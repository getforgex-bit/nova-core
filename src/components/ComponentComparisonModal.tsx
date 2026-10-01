import React, { useState, useMemo } from 'react';
import { HardwareComponent } from '../types';
import { HARDWARE_CATALOG } from '../data/hardware';

interface ComponentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentA: HardwareComponent;
  componentB: HardwareComponent;
  onSelectComponentA: (component: HardwareComponent) => void;
  onSelectComponentB: (component: HardwareComponent) => void;
  onAddToCart: (name: string, price: number, sku?: string, image?: string, category?: string) => void;
  onUseInBuild: (component: HardwareComponent) => void;
}

interface ParsedSpecs {
  clockSpeed: {
    boost: string;
    base: string;
    memoryFreq: string;
    rawBoostGHz?: number;
  };
  tdp: {
    wattage: number;
    text: string;
    profile: string;
  };
  latency: {
    primary: string;
    cache: string;
    busWidth: string;
    rawCl?: number;
  };
  architecture: {
    name: string;
    coresThreads: string;
    socket: string;
    formFactor: string;
  };
  extraSpecs: { label: string; value: string }[];
}

function parseTechnicalSpecs(comp: HardwareComponent): ParsedSpecs {
  const subtitle = comp.subtitle.toLowerCase();
  const name = comp.name.toLowerCase();
  const allText = `${comp.name} ${comp.subtitle} ${comp.badgeTopLeft || ''} ${comp.badgeBottomRight || ''} ${comp.specs.map((s) => `${s.label} ${s.value}`).join(' ')}`.toLowerCase();

  // 1. Clock Speed extraction
  let boost = 'N/A';
  let base = 'Estándar';
  let memoryFreq = 'N/A';
  let rawBoostGHz: number | undefined;

  const boostMatch = comp.subtitle.match(/boost\s*([0-9.]+)\s*ghz/i);
  if (boostMatch) {
    boost = `${boostMatch[1]} GHz Boost`;
    rawBoostGHz = parseFloat(boostMatch[1]);
  } else if (comp.category === 'ram') {
    const mhzMatch = comp.subtitle.match(/([0-9]{4})\s*(mt\/s|mhz)/i) || comp.badgeBottomRight?.match(/([0-9]{4})\s*(mt\/s|mhz)/i);
    if (mhzMatch) {
      boost = `${mhzMatch[1]} MT/s Frecuencia Operativa`;
      memoryFreq = `${mhzMatch[1]} MHz`;
    }
  } else if (comp.category === 'gpu') {
    boost = '2475 MHz (Boost Clock Ada)';
    base = '1980 MHz (Base Clock)';
    memoryFreq = '21 Gbps (GDDR6X)';
  } else if (comp.category === 'perif') {
    const hzMatch = comp.subtitle.match(/([0-9]+)\s*hz/i) || comp.badgeBottomRight?.match(/([0-9]+)\s*hz/i);
    if (hzMatch) {
      boost = `${hzMatch[1]} Hz Tasa de Refresco`;
    }
    const pollMatch = allText.match(/([0-9]+)\s*hz/i);
    if (pollMatch && !hzMatch) {
      boost = `${pollMatch[1]} Hz Polling Rate`;
    }
  } else if (comp.category === 'ssd') {
    const readMatch = comp.badgeBottomRight?.match(/([0-9]+)\s*mb\/s/i) || comp.subtitle.match(/([0-9]+)\s*mb\/s/i);
    if (readMatch) {
      boost = `${readMatch[1]} MB/s Lectura Secuencial`;
    }
  }

  // Check specs for clock info
  comp.specs.forEach((s) => {
    const lbl = s.label.toLowerCase();
    const val = s.value.toLowerCase();
    if (lbl.includes('frecuencia') || lbl.includes('reloj') || lbl.includes('lectura')) {
      if (boost === 'N/A') boost = s.value;
    }
    if (lbl.includes('memoria') && val.includes('mhz')) {
      memoryFreq = s.value;
    }
  });

  // 2. TDP extraction
  let tdpWattage = comp.tdpWattage || 0;
  if (!tdpWattage) {
    const tdpMatch = allText.match(/([0-9]+)\s*w(?:atts)?\b/i);
    if (tdpMatch) {
      tdpWattage = parseInt(tdpMatch[1], 10);
    } else {
      if (comp.category === 'cpu') tdpWattage = 105;
      else if (comp.category === 'gpu') tdpWattage = 200;
      else if (comp.category === 'psu') tdpWattage = 850;
      else if (comp.category === 'ram') tdpWattage = 15;
      else if (comp.category === 'ssd') tdpWattage = 8;
      else if (comp.category === 'mobo') tdpWattage = 50;
      else tdpWattage = 25;
    }
  }

  let tdpProfile = 'Consumo Estándar';
  if (comp.category === 'psu') {
    tdpProfile = `${tdpWattage}W Capacidad Nominal Continua (80+ Gold)`;
  } else if (comp.category === 'thermal' && comp.specs.some((s) => s.value.includes('TDP'))) {
    tdpProfile = `Capacidad Disipación Térmica hasta ${tdpWattage}W`;
  } else if (tdpWattage >= 200) {
    tdpProfile = 'Alta Potencia / Requiere Conexión 12VHPWR o Dual 8-pin';
  } else if (tdpWattage >= 100) {
    tdpProfile = 'Consumo Medio-Alto / Disipación Doble Torre / 240mm AIO';
  } else {
    tdpProfile = 'Bajo Consumo Térmico / Eficiencia Pasiva o Flujo Moderado';
  }

  // 3. Memory Latency & Timings
  let primaryLatency = 'N/A';
  let cache = 'N/A';
  let busWidth = 'N/A';
  let rawCl: number | undefined;

  const clMatch = allText.match(/\bcl\s*([0-9]{2})\b/i);
  if (clMatch) {
    primaryLatency = `CL${clMatch[1]}`;
    rawCl = parseInt(clMatch[1], 10);
    const tightMatch = allText.match(/([0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2})/);
    if (tightMatch) {
      primaryLatency += ` (${tightMatch[1]})`;
    }
  } else if (allText.includes('1ms')) {
    primaryLatency = '1 ms GtG / Ultra-Low Latency';
  } else if (comp.category === 'perif') {
    primaryLatency = '1 ms Tiempo de Respuesta';
  } else if (comp.category === 'cpu') {
    primaryLatency = 'Sub-10ns Acceso On-Die a L3 V-Cache';
  } else if (comp.category === 'gpu') {
    primaryLatency = '192-bit / Sub-12ns GDDR6X VRAM Controller';
  }

  // Cache
  const cacheMatch = comp.subtitle.match(/([0-9]+\s*mb(?:\s*3d)?\s*v?-?cache)/i) || comp.subtitle.match(/([0-9]+\s*mb\s*cache)/i);
  if (cacheMatch) {
    cache = cacheMatch[1].toUpperCase();
  }
  comp.specs.forEach((s) => {
    if (s.label.toLowerCase().includes('cache') || s.value.toLowerCase().includes('cache')) {
      cache = s.value;
    }
  });

  // Bus width
  const busMatch = allText.match(/([0-9]{2,3}-bit\s*bus|[0-9]{2,3}-bit)/i);
  if (busMatch) {
    busWidth = busMatch[1].toUpperCase();
  } else if (comp.category === 'ram') {
    busWidth = '128-bit (Dual Channel 2x64-bit)';
  } else if (comp.category === 'cpu' || comp.category === 'mobo' || comp.category === 'ssd') {
    if (allText.includes('pcie 5.0')) busWidth = 'PCIe 5.0 (High Bandwidth)';
    else if (allText.includes('pcie 4.0')) busWidth = 'PCIe 4.0 x4 / x16';
  }

  // 4. Architecture
  let archName = 'Microarquitectura Estándar';
  let coresThreads = 'N/A';
  let socket = comp.badgeTopLeft || 'Universal';
  let formFactor = 'Estándar';

  const ctMatch = comp.subtitle.match(/([0-9]+\s*cores\s*\/\s*[0-9]+\s*threads)/i);
  if (ctMatch) {
    coresThreads = ctMatch[1];
  }
  const cudaMatch = comp.subtitle.match(/([0-9]+\s*cuda\s*cores)/i);
  if (cudaMatch) {
    coresThreads = cudaMatch[1];
  }

  comp.specs.forEach((s) => {
    const l = s.label.toLowerCase();
    if (l.includes('arquitectura')) archName = s.value;
    if (l.includes('formato') || l.includes('factor')) formFactor = s.value;
    if (l.includes('interfaz') || l.includes('socket')) socket = s.value;
  });

  if (archName === 'Microarquitectura Estándar') {
    if (name.includes('ryzen')) archName = 'AMD Zen 4 (5nm TSMC FinFET)';
    else if (name.includes('rtx')) archName = 'NVIDIA Ada Lovelace (TSMC 4N)';
    else if (name.includes('fury') || name.includes('vengeance')) archName = 'DDR5 SDRAM Micro-BGA';
    else if (name.includes('samsung') || name.includes('kc3000')) archName = '3D TLC V-NAND Flash';
  }

  return {
    clockSpeed: { boost, base, memoryFreq, rawBoostGHz },
    tdp: { wattage: tdpWattage, text: `${tdpWattage}W`, profile: tdpProfile },
    latency: { primary: primaryLatency, cache, busWidth, rawCl },
    architecture: { name: archName, coresThreads, socket, formFactor },
    extraSpecs: comp.specs,
  };
}

export const ComponentComparisonModal: React.FC<ComponentComparisonModalProps> = ({
  isOpen,
  onClose,
  componentA,
  componentB,
  onSelectComponentA,
  onSelectComponentB,
  onAddToCart,
  onUseInBuild,
}) => {
  const [searchFilterA, setSearchFilterA] = useState('');
  const [searchFilterB, setSearchFilterB] = useState('');
  const [isChangingA, setIsChangingA] = useState(false);
  const [isChangingB, setIsChangingB] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'same'>('same');

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isChangingA) setIsChangingA(false);
        else if (isChangingB) setIsChangingB(false);
        else onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isChangingA, isChangingB, onClose]);

  const parsedA = useMemo(() => parseTechnicalSpecs(componentA), [componentA]);
  const parsedB = useMemo(() => parseTechnicalSpecs(componentB), [componentB]);

  const priceDiff = componentA.price - componentB.price;
  const isSameCategory = componentA.category === componentB.category;

  const catalogOptionsA = useMemo(() => {
    return HARDWARE_CATALOG.filter((item) => {
      if (categoryFilter === 'same' && item.category !== componentA.category) return false;
      if (!searchFilterA.trim()) return true;
      const q = searchFilterA.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
    });
  }, [categoryFilter, componentA.category, searchFilterA]);

  const catalogOptionsB = useMemo(() => {
    return HARDWARE_CATALOG.filter((item) => {
      if (categoryFilter === 'same' && item.category !== componentB.category) return false;
      if (!searchFilterB.trim()) return true;
      const q = searchFilterB.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
    });
  }, [categoryFilter, componentB.category, searchFilterB]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-label="Cerrar modal de comparación"
      />

      {/* Main Container with Swiss Design */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-modal-title"
        className="relative w-full max-w-5xl bg-white border border-black shadow-[10px_10px_0px_0px_#000000] z-10 flex flex-col max-h-[94vh] overflow-hidden my-auto"
      >
        {/* Top Control Bar */}
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b border-black shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#0050cc] border border-white/50"></span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] bg-[#0050cc] text-white px-1.5 py-0.2 font-bold tracking-wider">
                  TELEMETRÍA COMPARATIVA
                </span>
                <span className="font-mono text-[10px] text-[#747878] hidden sm:inline">
                  [SYS.COMPARE // MATRIX 2.0]
                </span>
              </div>
              <h2
                id="comparison-modal-title"
                className="font-['Space_Grotesk'] text-[16px] sm:text-[18px] uppercase font-bold tracking-tight text-white leading-tight"
              >
                Comparador Técnico Lado a Lado
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Swap A and B
                const temp = componentA;
                onSelectComponentA(componentB);
                onSelectComponentB(temp);
              }}
              title="Intercambiar posiciones"
              className="px-2.5 py-1 text-white hover:text-black hover:bg-white border border-white/30 hover:border-white font-mono text-[10px] uppercase font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
              <span className="hidden sm:inline">Invertir</span>
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-[#0050cc] hover:bg-white transition-colors p-1.5 cursor-pointer border border-transparent hover:border-black flex items-center justify-center"
              aria-label="Cerrar modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Category Alignment Indicator */}
        <div className="bg-[#f6f3ec] px-4 py-2 border-b border-[#c4c7c7] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#444748] uppercase">MODO DE ANÁLISIS:</span>
            {isSameCategory ? (
              <span className="bg-[#0050cc] text-white px-2 py-0.5 font-bold uppercase text-[10px]">
                EQUIVALENCIA DE CATEGORÍA ({componentA.category.toUpperCase()})
              </span>
            ) : (
              <span className="bg-amber-600 text-white px-2 py-0.5 font-bold uppercase text-[10px]">
                CROSS-CATEGORY ({componentA.category.toUpperCase()} vs {componentB.category.toUpperCase()})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#444748] hidden md:inline">
              Diferencia de inversión:
            </span>
            <span
              className={`font-['Space_Grotesk'] text-[13px] font-bold ${
                priceDiff === 0
                  ? 'text-black'
                  : priceDiff > 0
                  ? 'text-black'
                  : 'text-[#0050cc]'
              }`}
            >
              {priceDiff === 0
                ? 'Precios idénticos'
                : priceDiff > 0
                ? `Componente A es $${Math.abs(priceDiff).toLocaleString('es-MX')} MXN (+${Math.round((Math.abs(priceDiff) / componentB.price) * 100)}%) mayor`
                : `Componente B es $${Math.abs(priceDiff).toLocaleString('es-MX')} MXN (+${Math.round((Math.abs(priceDiff) / componentA.price) * 100)}%) mayor`}
            </span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Component Cards (Side-by-side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black border-b border-black bg-white">
            {/* COMPONENT A */}
            <div className="p-4 sm:p-5 flex flex-col justify-between bg-white relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] bg-black text-white px-1.5 py-0.5 uppercase font-bold tracking-wider">
                  CANAL ALPHA // SLOT 01
                </span>
                <button
                  onClick={() => setIsChangingA(!isChangingA)}
                  className="font-mono text-[10px] text-[#0050cc] hover:underline uppercase font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                  {isChangingA ? 'Cancelar cambio' : 'Cambiar componente'}
                </button>
              </div>

              {/* In-modal Selector Dropdown A */}
              {isChangingA && (
                <div className="mb-4 p-3 bg-[#f6f3ec] border border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      SELECCIONAR REEMPLAZO CANAL ALPHA:
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCategoryFilter('same')}
                        className={`px-1.5 py-0.5 font-mono text-[9px] uppercase border ${
                          categoryFilter === 'same'
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white text-black border-[#c4c7c7]'
                        }`}
                      >
                        Misma Categoría
                      </button>
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-1.5 py-0.5 font-mono text-[9px] uppercase border ${
                          categoryFilter === 'all'
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white text-black border-[#c4c7c7]'
                        }`}
                      >
                        Todo el Catálogo
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={searchFilterA}
                    onChange={(e) => setSearchFilterA(e.target.value)}
                    placeholder="Filtrar por nombre, marca o SKU..."
                    className="w-full bg-white border border-black px-2 py-1 font-mono text-[11px] text-black focus:outline-none"
                  />
                  <div className="max-h-40 overflow-y-auto divide-y divide-[#ebe8e1] border border-[#c4c7c7] bg-white">
                    {catalogOptionsA.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectComponentA(item);
                          setIsChangingA(false);
                        }}
                        className={`w-full text-left p-2 hover:bg-[#f6f3ec] flex items-center justify-between text-[11px] font-mono cursor-pointer ${
                          item.id === componentA.id ? 'bg-[#f1eee7] font-bold' : ''
                        }`}
                      >
                        <span className="truncate pr-2">
                          [{item.sku}] {item.name}
                        </span>
                        <span className="text-[#0050cc] font-bold shrink-0">
                          ${item.price.toLocaleString('es-MX')} MXN
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product A Identity */}
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#ebe8e1] border border-black shrink-0 relative overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={componentA.image}
                    alt={componentA.name}
                    className="w-full h-full object-cover"
                  />
                  {componentA.badgeTopLeft && (
                    <span className="absolute top-1 left-1 bg-black text-white font-mono text-[8px] px-1 py-0.2 uppercase font-bold">
                      {componentA.badgeTopLeft}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#747878] uppercase">
                    <span>{componentA.brand}</span>
                    <span>•</span>
                    <span className="font-bold text-black">[{componentA.sku}]</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-[17px] sm:text-[19px] font-bold text-black uppercase leading-tight tracking-tight mt-0.5">
                    {componentA.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[#444748] mt-1 line-clamp-2">
                    {componentA.subtitle}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-['Space_Grotesk'] text-[20px] font-bold text-black">
                      ${componentA.price.toLocaleString('es-MX')}
                    </span>
                    <span className="font-mono text-[10px] text-[#747878]">MXN NETO</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons A */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#ebe8e1]">
                <button
                  onClick={() =>
                    onAddToCart(
                      componentA.name,
                      componentA.price,
                      componentA.sku,
                      componentA.image,
                      componentA.category
                    )
                  }
                  className="bg-black text-white hover:bg-[#0050cc] font-mono text-[10px] uppercase py-2 font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-black"
                >
                  <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                  <span>Añadir</span>
                </button>
                <button
                  onClick={() => {
                    onUseInBuild(componentA);
                    onClose();
                  }}
                  className="bg-[#f6f3ec] text-black hover:bg-black hover:text-white font-mono text-[10px] uppercase py-2 font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-black"
                >
                  <span className="material-symbols-outlined text-[15px]">precision_manufacturing</span>
                  <span>Ensamble</span>
                </button>
              </div>
            </div>

            {/* COMPONENT B */}
            <div className="p-4 sm:p-5 flex flex-col justify-between bg-white relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] bg-[#0050cc] text-white px-1.5 py-0.5 uppercase font-bold tracking-wider">
                  CANAL BETA // SLOT 02
                </span>
                <button
                  onClick={() => setIsChangingB(!isChangingB)}
                  className="font-mono text-[10px] text-[#0050cc] hover:underline uppercase font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                  {isChangingB ? 'Cancelar cambio' : 'Cambiar componente'}
                </button>
              </div>

              {/* In-modal Selector Dropdown B */}
              {isChangingB && (
                <div className="mb-4 p-3 bg-[#f6f3ec] border border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      SELECCIONAR REEMPLAZO CANAL BETA:
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCategoryFilter('same')}
                        className={`px-1.5 py-0.5 font-mono text-[9px] uppercase border ${
                          categoryFilter === 'same'
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white text-black border-[#c4c7c7]'
                        }`}
                      >
                        Misma Categoría
                      </button>
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-1.5 py-0.5 font-mono text-[9px] uppercase border ${
                          categoryFilter === 'all'
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white text-black border-[#c4c7c7]'
                        }`}
                      >
                        Todo el Catálogo
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={searchFilterB}
                    onChange={(e) => setSearchFilterB(e.target.value)}
                    placeholder="Filtrar por nombre, marca o SKU..."
                    className="w-full bg-white border border-black px-2 py-1 font-mono text-[11px] text-black focus:outline-none"
                  />
                  <div className="max-h-40 overflow-y-auto divide-y divide-[#ebe8e1] border border-[#c4c7c7] bg-white">
                    {catalogOptionsB.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectComponentB(item);
                          setIsChangingB(false);
                        }}
                        className={`w-full text-left p-2 hover:bg-[#f6f3ec] flex items-center justify-between text-[11px] font-mono cursor-pointer ${
                          item.id === componentB.id ? 'bg-[#f1eee7] font-bold' : ''
                        }`}
                      >
                        <span className="truncate pr-2">
                          [{item.sku}] {item.name}
                        </span>
                        <span className="text-[#0050cc] font-bold shrink-0">
                          ${item.price.toLocaleString('es-MX')} MXN
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product B Identity */}
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#ebe8e1] border border-black shrink-0 relative overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={componentB.image}
                    alt={componentB.name}
                    className="w-full h-full object-cover"
                  />
                  {componentB.badgeTopLeft && (
                    <span className="absolute top-1 left-1 bg-[#0050cc] text-white font-mono text-[8px] px-1 py-0.2 uppercase font-bold">
                      {componentB.badgeTopLeft}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#747878] uppercase">
                    <span>{componentB.brand}</span>
                    <span>•</span>
                    <span className="font-bold text-black">[{componentB.sku}]</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-[17px] sm:text-[19px] font-bold text-black uppercase leading-tight tracking-tight mt-0.5">
                    {componentB.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[#444748] mt-1 line-clamp-2">
                    {componentB.subtitle}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-['Space_Grotesk'] text-[20px] font-bold text-black">
                      ${componentB.price.toLocaleString('es-MX')}
                    </span>
                    <span className="font-mono text-[10px] text-[#747878]">MXN NETO</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons B */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#ebe8e1]">
                <button
                  onClick={() =>
                    onAddToCart(
                      componentB.name,
                      componentB.price,
                      componentB.sku,
                      componentB.image,
                      componentB.category
                    )
                  }
                  className="bg-black text-white hover:bg-[#0050cc] font-mono text-[10px] uppercase py-2 font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-black"
                >
                  <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                  <span>Añadir</span>
                </button>
                <button
                  onClick={() => {
                    onUseInBuild(componentB);
                    onClose();
                  }}
                  className="bg-[#f6f3ec] text-black hover:bg-black hover:text-white font-mono text-[10px] uppercase py-2 font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-black"
                >
                  <span className="material-symbols-outlined text-[15px]">precision_manufacturing</span>
                  <span>Ensamble</span>
                </button>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE TECHNICAL SPECIFICATIONS TABLE */}
          <div className="p-4 sm:p-6 bg-[#faf9f5]">
            <div className="bg-white border border-black shadow-xs">
              <table className="w-full border-collapse text-left font-mono text-[11px]">
                {/* Table Header */}
                <thead>
                  <tr className="bg-black text-white border-b border-black uppercase text-[10px]">
                    <th className="p-3 w-1/3 border-r border-white/20 font-bold tracking-wider">
                      PARÁMETRO TÉCNICO / TELEMETRÍA
                    </th>
                    <th className="p-3 w-1/3 border-r border-white/20 font-bold tracking-wider">
                      {componentA.brand} // {componentA.name.split(' ').slice(0, 3).join(' ')}
                    </th>
                    <th className="p-3 w-1/3 font-bold tracking-wider">
                      {componentB.brand} // {componentB.name.split(' ').slice(0, 3).join(' ')}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* ================= SECTION 1: CLOCK SPEED ================= */}
                  <tr className="bg-[#f1eee7] border-y border-black font-mono">
                    <td
                      colSpan={3}
                      className="px-3 py-1.5 text-[10px] uppercase font-bold text-black flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        speed
                      </span>
                      <span>01. FRECUENCIAS DE RELOJ & VELOCIDAD (CLOCK SPEED)</span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Frecuencia Máxima / Boost
                      <div className="text-[9px] text-[#747878] font-normal">
                        Frecuencia pico alcanzable en mono/multi-núcleo
                      </div>
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0]">
                      <span className="font-bold text-black">{parsedA.clockSpeed.boost}</span>
                      {parsedA.clockSpeed.rawBoostGHz && parsedB.clockSpeed.rawBoostGHz && (
                        <div className="text-[10px] mt-0.5">
                          {parsedA.clockSpeed.rawBoostGHz > parsedB.clockSpeed.rawBoostGHz ? (
                            <span className="text-[#0050cc] font-bold">
                              ▲ +{(parsedA.clockSpeed.rawBoostGHz - parsedB.clockSpeed.rawBoostGHz).toFixed(1)} GHz superior
                            </span>
                          ) : parsedA.clockSpeed.rawBoostGHz < parsedB.clockSpeed.rawBoostGHz ? (
                            <span className="text-[#747878]">
                              ▼ -{(parsedB.clockSpeed.rawBoostGHz - parsedA.clockSpeed.rawBoostGHz).toFixed(1)} GHz
                            </span>
                          ) : (
                            <span className="text-[#444748]">= Frecuencia idéntica</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-black">{parsedB.clockSpeed.boost}</span>
                      {parsedA.clockSpeed.rawBoostGHz && parsedB.clockSpeed.rawBoostGHz && (
                        <div className="text-[10px] mt-0.5">
                          {parsedB.clockSpeed.rawBoostGHz > parsedA.clockSpeed.rawBoostGHz ? (
                            <span className="text-[#0050cc] font-bold">
                              ▲ +{(parsedB.clockSpeed.rawBoostGHz - parsedA.clockSpeed.rawBoostGHz).toFixed(1)} GHz superior
                            </span>
                          ) : parsedB.clockSpeed.rawBoostGHz < parsedA.clockSpeed.rawBoostGHz ? (
                            <span className="text-[#747878]">
                              ▼ -{(parsedA.clockSpeed.rawBoostGHz - parsedB.clockSpeed.rawBoostGHz).toFixed(1)} GHz
                            </span>
                          ) : (
                            <span className="text-[#444748]">= Frecuencia idéntica</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Frecuencia Base / Régimen Operativo
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      {parsedA.clockSpeed.base}
                    </td>
                    <td className="p-3 text-[#444748]">{parsedB.clockSpeed.base}</td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Velocidad de Bus / Memoria Asociada
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      {parsedA.clockSpeed.memoryFreq}
                    </td>
                    <td className="p-3 text-[#444748]">{parsedB.clockSpeed.memoryFreq}</td>
                  </tr>

                  {/* ================= SECTION 2: TDP & POWER ================= */}
                  <tr className="bg-[#f1eee7] border-y border-black font-mono">
                    <td
                      colSpan={3}
                      className="px-3 py-1.5 text-[10px] uppercase font-bold text-black flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        bolt
                      </span>
                      <span>02. POTENCIA & DISIPACIÓN TÉRMICA (TDP & POWER)</span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Consumo Térmico Nominal (TDP Watts)
                      <div className="text-[9px] text-[#747878] font-normal">
                        Thermal Design Power especificado por fabricante
                      </div>
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0]">
                      <div className="flex items-center gap-2">
                        <span className="font-['Space_Grotesk'] text-[15px] font-bold text-black">
                          {parsedA.tdp.text}
                        </span>
                        {componentA.category === 'psu' && (
                          <span className="text-[9px] bg-black text-white px-1 font-bold">
                            CAPACIDAD
                          </span>
                        )}
                      </div>
                      {parsedA.tdp.wattage > 0 && parsedB.tdp.wattage > 0 && isSameCategory && componentA.category !== 'psu' && (
                        <div className="text-[10px] mt-0.5">
                          {parsedA.tdp.wattage < parsedB.tdp.wattage ? (
                            <span className="text-emerald-700 font-bold">
                              ✓ {parsedB.tdp.wattage - parsedA.tdp.wattage}W menor consumo (Más eficiente)
                            </span>
                          ) : parsedA.tdp.wattage > parsedB.tdp.wattage ? (
                            <span className="text-amber-700">
                              ▲ +{parsedA.tdp.wattage - parsedB.tdp.wattage}W mayor requerimiento
                            </span>
                          ) : (
                            <span className="text-[#444748]">= Consumo equivalente</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-['Space_Grotesk'] text-[15px] font-bold text-black">
                          {parsedB.tdp.text}
                        </span>
                        {componentB.category === 'psu' && (
                          <span className="text-[9px] bg-black text-white px-1 font-bold">
                            CAPACIDAD
                          </span>
                        )}
                      </div>
                      {parsedA.tdp.wattage > 0 && parsedB.tdp.wattage > 0 && isSameCategory && componentB.category !== 'psu' && (
                        <div className="text-[10px] mt-0.5">
                          {parsedB.tdp.wattage < parsedA.tdp.wattage ? (
                            <span className="text-emerald-700 font-bold">
                              ✓ {parsedA.tdp.wattage - parsedB.tdp.wattage}W menor consumo (Más eficiente)
                            </span>
                          ) : parsedB.tdp.wattage > parsedA.tdp.wattage ? (
                            <span className="text-amber-700">
                              ▲ +{parsedB.tdp.wattage - parsedA.tdp.wattage}W mayor requerimiento
                            </span>
                          ) : (
                            <span className="text-[#444748]">= Consumo equivalente</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Perfil Térmico & Solución Recomendada
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      {parsedA.tdp.profile}
                    </td>
                    <td className="p-3 text-[#444748]">{parsedB.tdp.profile}</td>
                  </tr>

                  {/* ================= SECTION 3: MEMORY LATENCY ================= */}
                  <tr className="bg-[#f1eee7] border-y border-black font-mono">
                    <td
                      colSpan={3}
                      className="px-3 py-1.5 text-[10px] uppercase font-bold text-black flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        timer
                      </span>
                      <span>03. LATENCIAS & TIEMPOS DE RESPUESTA (MEMORY LATENCY)</span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Latencia Primaria (CAS / CL / GtG)
                      <div className="text-[9px] text-[#747878] font-normal">
                        Ciclos de retardo de reloj para acceder a registros
                      </div>
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0]">
                      <span className="font-bold text-black">{parsedA.latency.primary}</span>
                      {parsedA.latency.rawCl && parsedB.latency.rawCl && (
                        <div className="text-[10px] mt-0.5">
                          {parsedA.latency.rawCl < parsedB.latency.rawCl ? (
                            <span className="text-emerald-700 font-bold">
                              ✓ CL{parsedA.latency.rawCl} vs CL{parsedB.latency.rawCl} (Menor latencia = Mayor rapidez)
                            </span>
                          ) : parsedA.latency.rawCl > parsedB.latency.rawCl ? (
                            <span className="text-amber-700">
                              ▲ CL{parsedA.latency.rawCl} (+{parsedA.latency.rawCl - parsedB.latency.rawCl} ciclos de retardo)
                            </span>
                          ) : (
                            <span className="text-[#444748]">= Misma latencia CAS</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-black">{parsedB.latency.primary}</span>
                      {parsedA.latency.rawCl && parsedB.latency.rawCl && (
                        <div className="text-[10px] mt-0.5">
                          {parsedB.latency.rawCl < parsedA.latency.rawCl ? (
                            <span className="text-emerald-700 font-bold">
                              ✓ CL{parsedB.latency.rawCl} vs CL{parsedA.latency.rawCl} (Menor latencia = Mayor rapidez)
                            </span>
                          ) : parsedB.latency.rawCl > parsedA.latency.rawCl ? (
                            <span className="text-amber-700">
                              ▲ CL{parsedB.latency.rawCl} (+{parsedB.latency.rawCl - parsedA.latency.rawCl} ciclos de retardo)
                            </span>
                          ) : (
                            <span className="text-[#444748]">= Misma latencia CAS</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Memoria Caché / Búfer Integrado
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0]">
                      <span className="text-black font-semibold">{parsedA.latency.cache}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-black font-semibold">{parsedB.latency.cache}</span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Ancho de Bus & Interfaz de Datos
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      {parsedA.latency.busWidth}
                    </td>
                    <td className="p-3 text-[#444748]">{parsedB.latency.busWidth}</td>
                  </tr>

                  {/* ================= SECTION 4: ARCHITECTURE ================= */}
                  <tr className="bg-[#f1eee7] border-y border-black font-mono">
                    <td
                      colSpan={3}
                      className="px-3 py-1.5 text-[10px] uppercase font-bold text-black flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        memory
                      </span>
                      <span>04. MICROARQUITECTURA & COMPONENTES INTERNOS</span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Litografía & Arquitectura
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      {parsedA.architecture.name}
                    </td>
                    <td className="p-3 text-[#444748]">{parsedB.architecture.name}</td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Núcleos / Hilos / CUDA Cores
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0]">
                      <span className="font-bold text-black">
                        {parsedA.architecture.coresThreads}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-black">
                        {parsedB.architecture.coresThreads}
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Socket / Interfaz Mecánica
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      {parsedA.architecture.socket}
                    </td>
                    <td className="p-3 text-[#444748]">{parsedB.architecture.socket}</td>
                  </tr>

                  {/* ================= SECTION 5: COMMERCIAL ================= */}
                  <tr className="bg-[#f1eee7] border-y border-black font-mono">
                    <td
                      colSpan={3}
                      className="px-3 py-1.5 text-[10px] uppercase font-bold text-black flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        sell
                      </span>
                      <span>05. VALOR COMERCIAL & GARANTÍA DE LABORATORIO</span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e5e0] hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Precio Neto Oficial (MXN)
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0]">
                      <span className="font-['Space_Grotesk'] text-[16px] font-bold text-black">
                        ${componentA.price.toLocaleString('es-MX')} MXN
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-['Space_Grotesk'] text-[16px] font-bold text-black">
                        ${componentB.price.toLocaleString('es-MX')} MXN
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#fcfbf9]">
                    <td className="p-3 font-bold text-black border-r border-[#e5e5e0]">
                      Garantía & Validación de Calidad
                    </td>
                    <td className="p-3 border-r border-[#e5e5e0] text-[#444748]">
                      36 Meses Garantía Directa NOVA CORE Lab
                    </td>
                    <td className="p-3 text-[#444748]">
                      36 Meses Garantía Directa NOVA CORE Lab
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Technical Verdict / Summary Box */}
            <div className="mt-4 p-4 bg-white border border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">balance</span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-[14px] uppercase font-bold text-black tracking-tight">
                    Dictamen Técnico de Laboratorio
                  </h4>
                  <p className="font-mono text-[11px] text-[#444748]">
                    Ambos componentes cumplen con las especificaciones de tolerancia térmica y
                    estabilidad de voltaje certificadas bajo el protocolo de laboratorio NOVA CORE.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-black bg-white hover:bg-[#f6f3ec] text-black font-mono text-[11px] uppercase font-bold cursor-pointer transition-colors"
                >
                  Regresar al Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
