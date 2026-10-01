import React, { useState } from 'react';
import { ConfiguratorSlot, HardwareComponent } from '../types';
import { BuildAnalyticsPanel } from '../components/BuildAnalyticsPanel';

interface CustomBuildViewProps {
  slots: ConfiguratorSlot[];
  onOpenSlotPicker: (slot: ConfiguratorSlot) => void;
  onProceedOrder: (total: number, partsCount: number) => void;
  onShareQuote: () => void;
  onOpenQuickQuote: () => void;
}

export const CustomBuildView: React.FC<CustomBuildViewProps> = ({
  slots,
  onOpenSlotPicker,
  onProceedOrder,
  onShareQuote,
  onOpenQuickQuote,
}) => {
  // Service checkboxes
  const [includeAssembly, setIncludeAssembly] = useState(true);
  const [includeOS, setIncludeOS] = useState(true);
  const [includeStressTest, setIncludeStressTest] = useState(true);

  // Dynamic calculations
  const hardwareSubtotal = slots.reduce((acc, slot) => acc + slot.component.price, 0);

  const assemblyCost = includeAssembly ? 600 : 0;
  const osCost = includeOS ? 350 : 0;
  const stressCost = includeStressTest ? 250 : 0;
  const servicesSubtotal = assemblyCost + osCost + stressCost;

  const totalNeto = hardwareSubtotal + servicesSubtotal;
  const ivaAmount = Math.round(totalNeto * 0.16);

  // Calculate approximate TDP from CPU and GPU
  const cpuSlot = slots.find((s) => s.category === 'cpu');
  const gpuSlot = slots.find((s) => s.category === 'gpu');
  const psuSlot = slots.find((s) => s.category === 'psu');

  const cpuTdp = cpuSlot?.component.tdpWattage || 105;
  const gpuTdp = gpuSlot?.component.tdpWattage || 160;
  const baseMotherboardFanWattage = 155;
  const totalEstimatedWatts = cpuTdp + gpuTdp + baseMotherboardFanWattage;

  const psuWattageMatch = psuSlot?.component.name.match(/(\d+)W/);
  const maxPsuWatts = psuWattageMatch ? parseInt(psuWattageMatch[1], 10) : 750;
  const powerUsagePercent = Math.min(Math.round((totalEstimatedWatts / maxPsuWatts) * 100), 100);
  const headroomPercent = 100 - powerUsagePercent;

  return (
    <div className="flex flex-col w-full">
      {/* Sub-Header Metadatos de Sesión y Matriz Modular */}
      <section className="w-full bg-[#ebe8e1] px-4 md:px-12 py-3 border-b border-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase bg-black text-white px-1.5 py-0.5 font-bold">
              CFG-MOD: #8092-LATAM
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] font-bold">
              ESTACIÓN DE TRABAJO & RENDIMIENTO
            </span>
            <span className="hidden sm:inline-block text-[#c4c7c7]">/</span>
            <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0050cc] animate-pulse"></span>
              MATRIZ DE COMPATIBILIDAD DINÁMICA ACTIVA
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-[#444748]">
            <span>
              ESQUEMA DE CONTROL: <strong className="text-black font-bold">ATX GEN-5</strong>
            </span>
            <span>
              REVISIÓN: <strong className="text-black font-bold">v4.19</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Contenedor Principal Configurator (Asymmetric 12-Column Grid) */}
      <div className="w-full px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Ranuras de Componentes + Servicios (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            {/* Header de sección izquierda */}
            <div className="border-b border-black pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#444748] tracking-wider block font-bold">
                  [ETAPA 01 - ASIGNACIÓN DE HARDWARE]
                </span>
                <h1 className="font-['Space_Grotesk'] text-headline-lg uppercase text-black tracking-tight leading-none">
                  Ensamblaje a Medida
                </h1>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-mono text-[11px] uppercase text-[#444748] font-bold">
                  {slots.length}/{slots.length} SLOTS SELECCIONADOS
                </span>
              </div>
            </div>

            {/* Lista Monolítica Modular de Slots */}
            <div className="flex flex-col border border-black bg-white divide-y divide-black">
              {slots.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className="p-4 hover:bg-[#f6f3ec] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#f1eee7] border border-black flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-black text-[24px]">
                          {slot.icon}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 uppercase font-bold">
                            SLOT {slot.slotNumber}
                          </span>
                          <span className="font-mono text-[10px] text-[#444748] uppercase font-bold tracking-wider">
                            {slot.label}
                          </span>
                        </div>
                        <h2 className="font-['Space_Grotesk'] text-[18px] text-black uppercase font-bold">
                          {slot.component.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-[#444748]">
                          {slot.component.specs.map((sp, idx) => (
                            <span key={idx}>
                              {sp.label} <strong className="text-black font-semibold">{sp.value}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#ebe8e1] shrink-0">
                      <span className="font-mono text-[15px] font-bold text-black">
                        ${slot.component.price.toLocaleString('es-MX')} MXN
                      </span>
                      <button
                        onClick={() => onOpenSlotPicker(slot)}
                        className="font-mono text-[11px] uppercase tracking-wider underline hover:text-[#0050cc] text-black font-bold mt-1 cursor-pointer"
                        type="button"
                      >
                        Cambiar Slot
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ETAPA INTERMEDIA: PANEL DE VISUALIZACIÓN DE DATOS RECHARTS */}
            <div id="analytics-panel">
              <BuildAnalyticsPanel
                slots={slots}
                servicesSubtotal={servicesSubtotal}
                totalNeto={totalNeto}
              />
            </div>

            {/* ETAPA 02: Servicios Adicionales de Laboratorio */}
            <div className="border border-black bg-white p-6 space-y-4">
              <div className="border-b border-black pb-2 mb-4">
                <span className="font-mono text-[10px] uppercase text-[#444748] tracking-wider block font-bold">
                  [ETAPA 02 - INTEGRACIÓN & VALIDACIÓN TÉCNICA]
                </span>
                <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black font-bold">
                  Protocolos de Servicio Técnico Nova Core
                </h3>
              </div>

              <div className="space-y-3">
                {/* Opción 1: Ensamble */}
                <label className="flex items-start justify-between p-4 border border-[#c4c7c7] hover:border-black cursor-pointer transition-all bg-[#fcf9f2] select-none">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={includeAssembly}
                      onChange={(e) => setIncludeAssembly(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-black cursor-pointer"
                    />
                    <div>
                      <span className="font-mono text-[12px] font-bold uppercase text-black block">
                        Ensamble Profesional + Enrutamiento Estructural de Cables
                      </span>
                      <p className="font-sans text-[12px] text-[#444748] leading-relaxed mt-0.5">
                        Montaje en estación antiestática ISO, torque dinamométrico calibrado,
                        aplicación técnica de pasta térmica Arctic MX de micropartículas no
                        conductoras para máxima transferencia de calor disipador-procesador y
                        ruteo estructural.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-black whitespace-nowrap pl-3">
                    +$600 MXN
                  </span>
                </label>

                {/* Opción 2: Instalación SO */}
                <label className="flex items-start justify-between p-4 border border-[#c4c7c7] hover:border-black cursor-pointer transition-all bg-[#fcf9f2] select-none">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={includeOS}
                      onChange={(e) => setIncludeOS(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-black cursor-pointer"
                    />
                    <div>
                      <span className="font-mono text-[12px] font-bold uppercase text-black block">
                        Instalación Limpia de SO + Controladores y Flasheo de BIOS
                      </span>
                      <p className="font-sans text-[12px] text-[#444748] leading-relaxed mt-0.5">
                        Última versión UEFI estable, habilitación XMP/EXPO, curva de ventiladores
                        personalizada y drivers WHQL con cero bloatware.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-black whitespace-nowrap pl-3">
                    +$350 MXN
                  </span>
                </label>

                {/* Opción 3: Estrés Térmico */}
                <label className="flex items-start justify-between p-4 border border-[#c4c7c7] hover:border-black cursor-pointer transition-all bg-[#fcf9f2] select-none">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={includeStressTest}
                      onChange={(e) => setIncludeStressTest(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-black cursor-pointer"
                    />
                    <div>
                      <span className="font-mono text-[12px] font-bold uppercase text-black block">
                        Test de Estrés Térmico & Carga Eléctrica 24H
                      </span>
                      <p className="font-sans text-[12px] text-[#444748] leading-relaxed mt-0.5">
                        Prueba continuada con FurMark + Cinebench bajo telemetría estricta de voltajes
                        y temperaturas máximas con informe individualizado.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-black whitespace-nowrap pl-3">
                    +$250 MXN
                  </span>
                </label>
              </div>
            </div>

            {/* Banner de Red Mayorista & Suministro */}
            <div className="border border-black p-4 bg-[#f1eee7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase bg-white px-2 py-0.5 text-black border border-black font-bold">
                  CADENA DE SUMINISTRO DIRECTA
                </span>
                <p className="font-sans text-[13px] text-[#444748] max-w-xl">
                  Componentes provistos con garantía de origen mediante red autorizada mayorista
                  (Grupo CVA, Intcomex). Trazabilidad de número de serie individual registrada en
                  Nova Core.
                </p>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase font-bold text-black shrink-0">
                <span>DISTRIBUCIÓN CERTIFICADA</span>
                <span className="material-symbols-outlined text-[16px] text-[#0050cc]">verified</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen Técnico, Consumo y Presupuesto (4 cols Sticky) */}
          <div className="lg:col-span-4 sticky top-20 flex flex-col space-y-4">
            {/* Panel de Estado Técnico & Compatibilidad */}
            <div className="border border-black bg-white p-6 space-y-4 shadow-[4px_4px_0px_0px_#000000]">
              <div className="border-b border-black pb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#444748] font-bold">
                  [TELEMETRÍA CONFIGURADOR]
                </span>
                <span className="w-2.5 h-2.5 bg-[#0050cc] inline-block"></span>
              </div>

              {/* Badge de Compatibilidad Absoluta */}
              <div className="border border-black bg-black text-white p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#b3c5ff] text-[24px]">
                  verified
                </span>
                <div>
                  <span className="font-mono text-[12px] uppercase font-bold block leading-tight">
                    100% COMPATIBILIDAD VERIFICADA
                  </span>
                  <span className="font-mono text-[10px] text-[#ebe8e1] block leading-none mt-0.5">
                    Socket AM5 · DDR5 · ATX Form Clearance OK
                  </span>
                </div>
              </div>

              {/* Matriz de Dimensiones y Espacios Físicos */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between border-b border-[#ebe8e1] pb-1">
                  <span className="text-[#444748] uppercase">CLEARANCE COOLER EN CHASIS:</span>
                  <span className="font-bold text-black">160mm / 165mm (+5mm OK)</span>
                </div>
                <div className="flex justify-between border-b border-[#ebe8e1] pb-1">
                  <span className="text-[#444748] uppercase">LONGITUD GPU EN CHASIS:</span>
                  <span className="font-bold text-black">281mm / 365mm (+84mm OK)</span>
                </div>
                <div className="flex justify-between border-b border-[#ebe8e1] pb-1">
                  <span className="text-[#444748] uppercase">INTERFAZ DE BUS:</span>
                  <span className="font-bold text-[#0050cc]">PCIe 4.0 x16 NATIVO</span>
                </div>
              </div>

              {/* Calculadora Dinámica de Consumo Energético */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="uppercase text-[#444748] font-bold">
                    PRESUPUESTO ELÉCTRICO ESTIMADO
                  </span>
                  <span className="font-bold text-black">
                    {totalEstimatedWatts}W / {maxPsuWatts}W
                  </span>
                </div>

                {/* Barra de Consumo Estilo Suizo */}
                <div className="w-full h-4 border border-black bg-[#f1eee7] p-0.5 flex">
                  <div
                    className="h-full bg-[#0050cc] transition-all duration-300"
                    style={{ width: `${powerUsagePercent}%` }}
                  ></div>
                  <div
                    className="h-full bg-[#ebe8e1] transition-all duration-300"
                    style={{ width: `${headroomPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-[#444748]">
                  <span>0W (IDLE)</span>
                  <span>CARGA MÁXIMA ({totalEstimatedWatts}W)</span>
                  <span>PSU LÍMITE ({maxPsuWatts}W)</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="font-mono text-[10px] text-[#444748]">
                    Margen:{' '}
                    <strong className="text-black">
                      +{headroomPercent}% Headroom
                    </strong>
                  </p>
                  <a
                    href="#analytics-panel"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-[#0050cc] uppercase font-bold hover:underline"
                  >
                    <span>Telemetría Recharts</span>
                    <span className="material-symbols-outlined text-[14px]">query_stats</span>
                  </a>
                </div>
              </div>

              {/* Desglose Económico Transparente */}
              <div className="border-t border-black pt-4 space-y-1.5 font-mono text-[12px]">
                <span className="text-[10px] uppercase tracking-wider text-[#444748] block font-bold">
                  [DESGLOSE DE COSTOS]
                </span>
                <div className="flex justify-between">
                  <span className="text-[#444748] uppercase">
                    Subtotal Componentes ({slots.length}):
                  </span>
                  <span className="font-bold text-black">
                    ${hardwareSubtotal.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#444748] uppercase">
                    Servicios Técnicos Seleccionados:
                  </span>
                  <span className="font-bold text-black">
                    ${servicesSubtotal.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <div className="flex justify-between border-b border-black pb-2">
                  <span className="text-[#444748] uppercase">I.V.A. (16% Incluido):</span>
                  <span className="font-bold text-black">
                    ${ivaAmount.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                <div className="pt-2 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#444748] block font-bold">
                      TOTAL NETO COTIZADO
                    </span>
                    <span className="font-['Space_Grotesk'] text-[24px] font-bold text-black tracking-tight">
                      ${totalNeto.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#ebe8e1] border border-[#c4c7c7] px-2 py-0.5 uppercase font-bold text-black">
                    VALOR FIJO 72H
                  </span>
                </div>
              </div>

              {/* Acciones de Conversión */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onProceedOrder(totalNeto, slots.length)}
                  className="w-full bg-black text-white py-3 px-4 font-mono text-[12px] uppercase tracking-wider font-bold border border-black hover:bg-[#0050cc] hover:border-[#0050cc] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">build_circle</span>
                  <span>Proceder al Pedido de Ensamble</span>
                </button>
                <button
                  onClick={onShareQuote}
                  className="w-full bg-white text-black py-2.5 px-4 font-mono text-[11px] uppercase tracking-wider font-bold border border-black hover:bg-[#f1eee7] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  <span>Guardar Presupuesto PDF / Compartir</span>
                </button>
              </div>

              {/* Garantía y Certificación Técnica Nova Core */}
              <div className="border-t border-[#ebe8e1] pt-3 space-y-2 text-[11px] font-mono text-[#444748]">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-black text-[16px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <span>
                    <strong>Garantía integral de 1 año</strong> directa en mano de obra, pruebas de
                    diagnóstico y soporte de ensamble por Nova Core Engineering.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-black text-[16px] shrink-0 mt-0.5">
                    swap_horiz
                  </span>
                  <span>
                    Garantía de fabricantes cubierta mediante mayoristas autorizados CVA e Intcomex
                    con sustitución express.
                  </span>
                </div>
              </div>
            </div>

            {/* Banner Auxiliar: Asesoría Técnica a Medida */}
            <div className="border border-black bg-[#f1eee7] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-black text-[18px]">
                  support_agent
                </span>
                <span className="font-mono text-[11px] font-bold uppercase text-black">
                  ¿Dudas de Arquitectura?
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#444748] leading-relaxed">
                Nuestros ingenieros de hardware pueden ajustar tu selección para producción
                audiovisual, renders o torneos esports según tu presupuesto objetivo.
              </p>
              <button
                onClick={onOpenQuickQuote}
                className="inline-block font-mono text-[10px] uppercase font-bold text-[#0050cc] underline hover:text-black pt-1 cursor-pointer"
              >
                Hablar con un Ingeniero de Sistemas →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
