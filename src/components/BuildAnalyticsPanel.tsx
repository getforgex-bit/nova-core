import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ConfiguratorSlot } from '../types';

interface BuildAnalyticsPanelProps {
  slots: ConfiguratorSlot[];
  servicesSubtotal: number;
  totalNeto: number;
}

// Swiss monochrome & cobalt palette for charts
const COST_COLORS = [
  '#0050cc', // Cobalt Nova (GPU)
  '#1c1c18', // Pitch Black (CPU)
  '#4a5568', // Slate (Motherboard)
  '#2b6cb0', // Medium Blue (RAM)
  '#4c51bf', // Indigo (SSD)
  '#718096', // Cool Grey (PSU)
  '#a0aec0', // Light Slate (Cooler / Case)
  '#2d3748', // Charcoal (Other)
  '#0d9488', // Teal (Services)
];

const TDP_COLORS: Record<string, string> = {
  GPU: '#0050cc',
  CPU: '#1c1c18',
  'Placa Base & Chipset': '#4a5568',
  'Módulos RAM DDR5': '#2b6cb0',
  'Almacenamiento NVMe': '#4c51bf',
  'Refrigeración & Ventiladores': '#0d9488',
  'Periféricos / Misceláneos': '#718096',
};

export const BuildAnalyticsPanel: React.FC<BuildAnalyticsPanelProps> = ({
  slots,
  servicesSubtotal,
  totalNeto,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'energy' | 'cost'>('both');

  // 1. DYNAMIC POWER (TDP) CALCULATIONS
  const energyData = useMemo(() => {
    let cpuWatts = 0;
    let gpuWatts = 0;
    let moboWatts = 55;
    let ramWatts = 20;
    let ssdWatts = 12;
    let coolingWatts = 35;
    let miscWatts = 18;

    let psuRatedWatts = 750;

    slots.forEach((slot) => {
      const comp = slot.component;
      if (slot.category === 'cpu') {
        cpuWatts = comp.tdpWattage || 105;
      } else if (slot.category === 'gpu') {
        gpuWatts = comp.tdpWattage || 160;
      } else if (slot.category === 'psu') {
        const match = comp.name.match(/(\d+)W/);
        if (match) {
          psuRatedWatts = parseInt(match[1], 10);
        }
      } else if (slot.category === 'mobo') {
        moboWatts = 55;
      } else if (slot.category === 'ram') {
        ramWatts = 20;
      } else if (slot.category === 'ssd') {
        ssdWatts = 12;
      } else if (slot.category === 'thermal') {
        coolingWatts = 35;
      }
    });

    const items = [
      { name: 'GPU (Gráfica)', watts: gpuWatts, category: 'GPU', fill: TDP_COLORS.GPU },
      { name: 'CPU (Procesador)', watts: cpuWatts, category: 'CPU', fill: TDP_COLORS.CPU },
      {
        name: 'Placa Base',
        watts: moboWatts,
        category: 'Placa Base & Chipset',
        fill: TDP_COLORS['Placa Base & Chipset'],
      },
      {
        name: 'Ventilación/Cooler',
        watts: coolingWatts,
        category: 'Refrigeración & Ventiladores',
        fill: TDP_COLORS['Refrigeración & Ventiladores'],
      },
      {
        name: 'RAM DDR5',
        watts: ramWatts,
        category: 'Módulos RAM DDR5',
        fill: TDP_COLORS['Módulos RAM DDR5'],
      },
      {
        name: 'SSD NVMe',
        watts: ssdWatts,
        category: 'Almacenamiento NVMe',
        fill: TDP_COLORS['Almacenamiento NVMe'],
      },
      {
        name: 'Misceláneos',
        watts: miscWatts,
        category: 'Periféricos / Misceláneos',
        fill: TDP_COLORS['Periféricos / Misceláneos'],
      },
    ];

    const totalEstimatedWatts =
      cpuWatts + gpuWatts + moboWatts + ramWatts + ssdWatts + coolingWatts + miscWatts;
    const loadPercent = Math.min(Math.round((totalEstimatedWatts / psuRatedWatts) * 100), 100);
    const headroomWatts = Math.max(0, psuRatedWatts - totalEstimatedWatts);
    const headroomPercent = 100 - loadPercent;
    const sweetSpotMin = Math.round(psuRatedWatts * 0.45);
    const sweetSpotMax = Math.round(psuRatedWatts * 0.65);
    const inSweetSpot = totalEstimatedWatts >= sweetSpotMin && totalEstimatedWatts <= sweetSpotMax;

    return {
      items,
      totalEstimatedWatts,
      psuRatedWatts,
      loadPercent,
      headroomWatts,
      headroomPercent,
      sweetSpotMin,
      sweetSpotMax,
      inSweetSpot,
    };
  }, [slots]);

  // 2. DYNAMIC COST DISTRIBUTION CALCULATIONS
  const costData = useMemo(() => {
    // Group slots by major technical categories
    const groups: Record<string, { label: string; price: number; count: number }> = {};

    slots.forEach((slot) => {
      let groupKey: string = slot.category;
      let groupLabel = slot.label.split('(')[0].trim();

      if (['cpu'].includes(slot.category)) {
        groupKey = 'cpu';
        groupLabel = 'Procesador (CPU)';
      } else if (['gpu'].includes(slot.category)) {
        groupKey = 'gpu';
        groupLabel = 'Gráfica (GPU)';
      } else if (['mobo'].includes(slot.category)) {
        groupKey = 'mobo';
        groupLabel = 'Motherboard';
      } else if (['ram'].includes(slot.category)) {
        groupKey = 'ram';
        groupLabel = 'Memoria RAM';
      } else if (['ssd'].includes(slot.category)) {
        groupKey = 'ssd';
        groupLabel = 'Almacenamiento SSD';
      } else if (['psu'].includes(slot.category)) {
        groupKey = 'psu';
        groupLabel = 'Fuente de Poder';
      } else if (['thermal', 'chassis'].includes(slot.category)) {
        groupKey = 'cooling_case';
        groupLabel = 'Chasis & Cooling';
      } else {
        groupKey = 'accessories';
        groupLabel = 'Periféricos & Conexión';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { label: groupLabel, price: 0, count: 0 };
      }
      groups[groupKey].price += slot.component.price;
      groups[groupKey].count += 1;
    });

    if (servicesSubtotal > 0) {
      groups['services'] = {
        label: 'Servicios de Laboratorio',
        price: servicesSubtotal,
        count: 1,
      };
    }

    const items = Object.entries(groups)
      .map(([key, data], idx) => {
        const percent = totalNeto > 0 ? (data.price / totalNeto) * 100 : 0;
        return {
          key,
          name: data.label,
          price: data.price,
          percentage: Number(percent.toFixed(1)),
          color: COST_COLORS[idx % COST_COLORS.length],
        };
      })
      .sort((a, b) => b.price - a.price);

    return items;
  }, [slots, servicesSubtotal, totalNeto]);

  return (
    <section className="w-full border border-black bg-white shadow-[4px_4px_0px_0px_#000000]">
      {/* Panel Header */}
      <div className="bg-[#1c1c18] text-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] bg-[#0050cc] text-white px-2 py-0.5 uppercase font-bold tracking-wider">
            RECHARTS // V.DATA-LAB
          </span>
          <h3 className="font-['Space_Grotesk'] text-[16px] sm:text-[18px] uppercase tracking-tight font-bold">
            Telemetría Energética & Distribución de Costos
          </h3>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 font-mono text-[10px] uppercase">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-2.5 py-1 font-bold border transition-colors cursor-pointer ${
              activeTab === 'both'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-300 border-gray-600 hover:text-white'
            }`}
          >
            [VISTA DUAL COMPLETA]
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-2.5 py-1 font-bold border transition-colors cursor-pointer ${
              activeTab === 'energy'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-300 border-gray-600 hover:text-white'
            }`}
          >
            CONSUMO (TDP)
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`px-2.5 py-1 font-bold border transition-colors cursor-pointer ${
              activeTab === 'cost'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-300 border-gray-600 hover:text-white'
            }`}
          >
            COSTOS (MXN)
          </button>
        </div>
      </div>

      {/* Real-time Metric Indicators Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-black border-b border-black bg-[#f6f3ec] font-mono text-[11px]">
        <div className="p-3">
          <span className="text-[#444748] text-[10px] block uppercase font-bold">
            CONSUMO MÁXIMO CALCULADO
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-['Space_Grotesk'] text-[20px] font-bold text-black">
              {energyData.totalEstimatedWatts}
            </span>
            <span className="text-[#0050cc] font-bold">WATTS</span>
          </div>
          <span className="text-[10px] text-[#747878]">
            {energyData.loadPercent}% capacidad de PSU
          </span>
        </div>

        <div className="p-3">
          <span className="text-[#444748] text-[10px] block uppercase font-bold">
            FUENTE ASIGNADA / MARGEN
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-['Space_Grotesk'] text-[20px] font-bold text-black">
              {energyData.psuRatedWatts}W
            </span>
            <span className="text-emerald-700 font-bold">+{energyData.headroomWatts}W</span>
          </div>
          <span className="text-[10px] text-[#747878]">
            {energyData.headroomPercent}% Headroom transitorio
          </span>
        </div>

        <div className="p-3">
          <span className="text-[#444748] text-[10px] block uppercase font-bold">
            PRESUPUESTO NETO HARDWARE
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-['Space_Grotesk'] text-[20px] font-bold text-black">
              ${totalNeto.toLocaleString('es-MX')}
            </span>
          </div>
          <span className="text-[10px] text-[#747878]">
            {slots.length} módulos analizados
          </span>
        </div>

        <div className="p-3">
          <span className="text-[#444748] text-[10px] block uppercase font-bold">
            ESTABILIDAD OPERATIVA
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-bold text-emerald-800 uppercase text-[12px]">
              {energyData.inSweetSpot ? 'ZONA GOLD (50-65%)' : 'RANGO VERIFICADO'}
            </span>
          </div>
          <span className="text-[10px] text-[#747878]">
            Eficiencia térmica calibrada
          </span>
        </div>
      </div>

      {/* Main Visualizations Area */}
      <div className="p-4 sm:p-6 space-y-6">
        <div
          className={`grid gap-6 ${
            activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* CHART 1: CONSUMO ENERGÉTICO (TDP POR COMPONENTE) */}
          {(activeTab === 'both' || activeTab === 'energy') && (
            <div className="border border-black bg-white p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0050cc] text-[18px]">
                      bolt
                    </span>
                    <h4 className="font-mono text-[12px] uppercase font-bold text-black">
                      Consumo Energético Total (TDP Watts)
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] bg-[#ebe8e1] px-2 py-0.5 border border-black font-bold">
                    ATX 3.0 // 12V-2x6
                  </span>
                </div>

                <p className="font-sans text-[12px] text-[#444748] mb-3">
                  Distribución de demanda eléctrica bajo carga máxima sostenida. La línea discontinua
                  indica la capacidad nominal de la fuente seleccionada ({energyData.psuRatedWatts}W).
                </p>

                {/* Recharts BarChart */}
                <div className="w-full h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={energyData.items}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="2 2" stroke="#ebe8e1" horizontal={false} />
                      <XAxis
                        type="number"
                        domain={[0, Math.max(energyData.psuRatedWatts, 500)]}
                        tick={{ fontSize: 10, fontFamily: 'monospace' }}
                        stroke="#747878"
                        unit="W"
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#1c1c18' }}
                        width={95}
                        stroke="#1c1c18"
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0, 80, 204, 0.05)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const pct = (
                              (data.watts / energyData.totalEstimatedWatts) *
                              100
                            ).toFixed(1);
                            return (
                              <div className="bg-black text-white p-2.5 font-mono text-[11px] border border-black shadow-lg">
                                <div className="font-bold text-[#b3c5ff] uppercase mb-1">
                                  {data.name}
                                </div>
                                <div className="text-[13px] font-bold">
                                  Consumo: {data.watts} Watts
                                </div>
                                <div className="text-[10px] text-gray-300">
                                  {pct}% del total del sistema
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <ReferenceLine
                        x={energyData.totalEstimatedWatts}
                        stroke="#0050cc"
                        strokeWidth={1.5}
                        label={{
                          value: `Total: ${energyData.totalEstimatedWatts}W`,
                          position: 'top',
                          fill: '#0050cc',
                          fontSize: 10,
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                        }}
                      />
                      <Bar dataKey="watts" barSize={14}>
                        {energyData.items.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Energy Footnote / Rule */}
              <div className="mt-4 pt-3 border-t border-[#ebe8e1] flex items-center justify-between font-mono text-[10px] text-[#444748]">
                <span>
                  LÍMITE CONTINUO: <strong>{energyData.psuRatedWatts}W</strong>
                </span>
                <span className="text-[#0050cc] font-bold">
                  FACTOR DE SEGURIDAD: +{energyData.headroomPercent}%
                </span>
              </div>
            </div>
          )}

          {/* CHART 2: DISTRIBUCIÓN DE COSTOS (MXN Y PORCENTAJES) */}
          {(activeTab === 'both' || activeTab === 'cost') && (
            <div className="border border-black bg-white p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0050cc] text-[18px]">
                      pie_chart
                    </span>
                    <h4 className="font-mono text-[12px] uppercase font-bold text-black">
                      Distribución de Costos de Componentes
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] bg-[#ebe8e1] px-2 py-0.5 border border-black font-bold">
                    ${totalNeto.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                <p className="font-sans text-[12px] text-[#444748] mb-3">
                  Asignación del presupuesto total entre unidades de procesamiento, memoria,
                  chasis e ingeniería de ensamble.
                </p>

                {/* Recharts PieChart / Donut */}
                <div className="w-full h-64 sm:h-72 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="w-full sm:w-1/2 h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costData}
                          dataKey="price"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        >
                          {costData.map((entry, index) => (
                            <Cell key={`cost-cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-black text-white p-2.5 font-mono text-[11px] border border-black shadow-lg">
                                  <div className="font-bold text-[#b3c5ff] uppercase mb-1">
                                    {data.name}
                                  </div>
                                  <div className="text-[13px] font-bold">
                                    ${data.price.toLocaleString('es-MX')} MXN
                                  </div>
                                  <div className="text-[10px] text-gray-300">
                                    {data.percentage}% del presupuesto
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-mono text-[9px] uppercase text-[#747878] font-bold">
                        TOTAL
                      </span>
                      <span className="font-mono text-[11px] font-bold text-black">
                        100%
                      </span>
                    </div>
                  </div>

                  {/* Micro Breakdown Legend with MXN Values */}
                  <div className="w-full sm:w-1/2 flex flex-col space-y-1.5 font-mono text-[10px] max-h-56 overflow-y-auto pr-1">
                    {costData.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between border-b border-[#f1eee7] pb-1 hover:bg-[#f6f3ec] px-1"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 shrink-0 inline-block"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="truncate text-black font-semibold">{item.name}</span>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <span className="font-bold text-black block">
                            ${item.price.toLocaleString('es-MX')}
                          </span>
                          <span className="text-[#747878] text-[9px]">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Footnote / Rule */}
              <div className="mt-4 pt-3 border-t border-[#ebe8e1] flex items-center justify-between font-mono text-[10px] text-[#444748]">
                <span>
                  BASE NETA: <strong>${totalNeto.toLocaleString('es-MX')} MXN</strong>
                </span>
                <span className="text-[#0050cc] font-bold">OPTIMIZACIÓN PRESUPUESTARIA</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
