import React, { useState, useMemo } from 'react';
import { ConfiguratorSlot } from '../types';
import { validateCpuMoboCompatibility } from '../utils/compatibilityValidator';

export type LightingEffect = 'static' | 'pulse' | 'breathing' | 'rainbow' | 'off';

export interface AmbientColorPreset {
  id: string;
  name: string;
  hex: string;
}

export const AMBIENT_COLOR_PRESETS: AmbientColorPreset[] = [
  { id: 'cobalt', name: 'Azul Cobalto Nova', hex: '#0050cc' },
  { id: 'cyan', name: 'Cian Cibernético', hex: '#06b6d4' },
  { id: 'emerald', name: 'Verde Matrix', hex: '#10b981' },
  { id: 'amber', name: 'Ámbar Termal', hex: '#f59e0b' },
  { id: 'crimson', name: 'Rojo Carmesí', hex: '#ef4444' },
  { id: 'purple', name: 'Ultravioleta', hex: '#8b5cf6' },
  { id: 'pink', name: 'Rosa Neón', hex: '#ec4899' },
  { id: 'white', name: 'Blanco Puro 6500K', hex: '#f8fafc' },
  { id: 'stealth', name: 'Stealth (Apagado)', hex: '#000000' },
];

interface ChassisSchematicViewProps {
  slots: ConfiguratorSlot[];
  onOpenSlotPicker?: (slot: ConfiguratorSlot) => void;
  ambientColor?: string;
  onAmbientColorChange?: (color: string) => void;
  lightingEffect?: LightingEffect;
  onLightingEffectChange?: (effect: LightingEffect) => void;
  lightingBrightness?: number;
  onLightingBrightnessChange?: (brightness: number) => void;
}

type ComponentFocus = 'all' | 'cpu' | 'gpu' | 'ram';
type StatusMode = 'compatibility' | 'thermal' | 'performance';

interface ComponentStatusEvaluation {
  status: 'optimal' | 'high_performance' | 'attention';
  colorHex: string;
  badgeText: string;
  detailText: string;
  metricLabel: string;
  metricValue: string;
  interfaceBus: string;
  clearanceNote: string;
}

export const ChassisSchematicView: React.FC<ChassisSchematicViewProps> = ({
  slots,
  onOpenSlotPicker,
  ambientColor,
  onAmbientColorChange,
  lightingEffect,
  onLightingEffectChange,
  lightingBrightness,
  onLightingBrightnessChange,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentFocus>('all');
  const [statusMode, setStatusMode] = useState<StatusMode>('compatibility');
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showAirflowVectors, setShowAirflowVectors] = useState<boolean>(true);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  // Internal lighting state if not controlled externally
  const [internalColor, setInternalColor] = useState<string>('#0050cc');
  const [internalEffect, setInternalEffect] = useState<LightingEffect>('static');
  const [internalBrightness, setInternalBrightness] = useState<number>(100);

  const activeColor = ambientColor !== undefined ? ambientColor : internalColor;
  const setActiveColor = onAmbientColorChange || setInternalColor;

  const activeEffect = lightingEffect !== undefined ? lightingEffect : internalEffect;
  const setActiveEffect = onLightingEffectChange || setInternalEffect;

  const activeBrightness = lightingBrightness !== undefined ? lightingBrightness : internalBrightness;
  const setActiveBrightness = onLightingBrightnessChange || setInternalBrightness;

  const isLightingOn = activeEffect !== 'off';
  const effectiveLightingFill =
    activeEffect === 'off'
      ? '#262c36'
      : activeEffect === 'rainbow'
      ? 'url(#argbRainbowGrad)'
      : activeColor;

  const effectiveOpacity = activeEffect === 'off' ? 0.25 : activeBrightness / 100;

  const currentColorName = useMemo(() => {
    if (activeEffect === 'off') return 'Stealth (LEDs Desactivados)';
    if (activeEffect === 'rainbow') return 'Espectro Arcoíris Dinámico';
    const found = AMBIENT_COLOR_PRESETS.find(
      (p) => p.hex.toLowerCase() === activeColor.toLowerCase()
    );
    return found ? found.name : `Personalizado (${activeColor.toUpperCase()})`;
  }, [activeColor, activeEffect]);

  const lightingAnimationClass = useMemo(() => {
    if (activeEffect === 'pulse') return 'ambient-pulse-fx';
    if (activeEffect === 'breathing') return 'ambient-breathing-fx';
    if (activeEffect === 'rainbow') return 'ambient-rainbow-fx';
    return '';
  }, [activeEffect]);

  // Extract key slots
  const cpuSlot = slots.find((s) => s.category === 'cpu');
  const gpuSlot = slots.find((s) => s.category === 'gpu');
  const ramSlot = slots.find((s) => s.category === 'ram');
  const moboSlot = slots.find((s) => s.category === 'mobo');
  const psuSlot = slots.find((s) => s.category === 'psu');
  const coolerSlot = slots.find(
    (s) => s.category === 'thermal' && s.label.toLowerCase().includes('refrigeración')
  );
  const caseSlot = slots.find((s) => s.category === 'chassis');

  // Dynamic Status Evaluation for CPU
  const cpuStatus: ComponentStatusEvaluation = useMemo(() => {
    const tdp = cpuSlot?.component.tdpWattage || 105;
    const name = cpuSlot?.component.name || 'Procesador Gen-5';
    const compat = validateCpuMoboCompatibility(cpuSlot?.component, moboSlot?.component);

    if (statusMode === 'compatibility') {
      if (!compat.isCompatible) {
        return {
          status: 'attention',
          colorHex: '#ef4444', // Red for incompatibility
          badgeText: 'ERROR // INCOMPATIBLE',
          detailText: compat.description,
          metricLabel: 'ZÓCALO / PINOUT',
          metricValue: `Socket ${compat.cpuSocket} ≠ ${compat.moboSocket}`,
          interfaceBus: compat.technicalDetails,
          clearanceNote: compat.suggestedAction,
        };
      }
      return {
        status: 'optimal',
        colorHex: '#10b981', // Emerald green
        badgeText: 'ÓPTIMO / 100% COMPATIBLE',
        detailText: `Socket ${compat.cpuSocket} validado con placa ${compat.moboChipset}.`,
        metricLabel: 'ZÓCALO / RETENCIÓN',
        metricValue: `${compat.cpuSocket} (Sincronizado)`,
        interfaceBus: 'PCIe 5.0 (24 Líneas Dedicadas)',
        clearanceNote: 'Clearance de Cooler: 160mm (Margen de +5mm disponible en chasis)',
      };
    } else if (statusMode === 'thermal') {
      if (tdp > 120) {
        return {
          status: 'attention',
          colorHex: '#f59e0b', // Amber
          badgeText: 'ALTA DISIPACIÓN TÉRMICA',
          detailText: `TDP de ${tdp}W requiere disipador de doble torre o AIO líquida 240mm+.`,
          metricLabel: 'CONSUMO TÉRMICO',
          metricValue: `${tdp} Watts TDP`,
          interfaceBus: 'Monitoreo PPT: 142W Límite',
          clearanceNote: 'Flujo de aire vertical y superior recomendado',
        };
      }
      return {
        status: 'high_performance',
        colorHex: '#0050cc', // Cobalt blue
        badgeText: 'EFICIENCIA BALANCEADA',
        detailText: `TDP térmico eficiente de ${tdp}W bajo arquitectura TSMC FinFET.`,
        metricLabel: 'CONSUMO TÉRMICO',
        metricValue: `${tdp} Watts TDP`,
        interfaceBus: 'Curva Térmica: 68°C - 74°C Max',
        clearanceNote: 'Disipador por aire DeepCool AK620 verificado',
      };
    } else {
      // performance mode
      return {
        status: 'high_performance',
        colorHex: '#0050cc',
        badgeText: 'BOOST CLOCK ULTRA-ALTO',
        detailText: 'Frecuencia turbo sostenida superior a 5.0 GHz con caché L3 optimizada.',
        metricLabel: 'FRECUENCIA RELOJ',
        metricValue: name.includes('7600X') ? '5.3 GHz Boost' : '5.0 GHz (96MB V-Cache)',
        interfaceBus: 'Instrucciones AVX-512 Nativas',
        clearanceNote: '2 Líneas directas a interfaz de memoria DDR5',
      };
    }
  }, [cpuSlot, moboSlot, statusMode]);

  // Dynamic Status Evaluation for RAM
  const ramStatus: ComponentStatusEvaluation = useMemo(() => {
    const name = ramSlot?.component.name || 'Memoria DDR5';

    if (statusMode === 'compatibility') {
      return {
        status: 'optimal',
        colorHex: '#10b981', // Emerald green
        badgeText: 'DUAL-CHANNEL SINCRONIZADO',
        detailText: 'Módulos instalados en Ranuras DIMM A2 y B2 para máxima integridad de señal.',
        metricLabel: 'CONFIGURACIÓN DE SLOTS',
        metricValue: 'Slots A2 + B2 (Recomendado)',
        interfaceBus: 'Bus DDR5 128-bit (2x 32-bit subcanales)',
        clearanceNote: 'Altura de módulo: 35mm (Clearance libre bajo torre de CPU)',
      };
    } else if (statusMode === 'thermal') {
      return {
        status: 'optimal',
        colorHex: '#10b981',
        badgeText: 'DISIPACIÓN PASIVA ÓPTIMA',
        detailText: 'Disipadores de aluminio anodizado con rango operativo térmico < 48°C.',
        metricLabel: 'VOLTAJE / TÉRMICO',
        metricValue: '1.35V DRAM VDD / 44°C Est.',
        interfaceBus: 'PMIC Integrado en PCB',
        clearanceNote: 'Recibe flujo directo de ventilador frontal superior',
      };
    } else {
      // performance mode
      return {
        status: 'high_performance',
        colorHex: '#0050cc', // Cobalt blue
        badgeText: 'PERFIL EXPO / XMP ACTIVO',
        detailText: 'Perfil AMD EXPO habilitado a 6000 MT/s con latencia ultrabaja CL30.',
        metricLabel: 'ANCHO DE BANDA',
        metricValue: '6000 MT/s (96 GB/s Teórico)',
        interfaceBus: 'Latencia CAS: CL30-36-36-76',
        clearanceNote: 'Relación 1:1 UCLK/MCLK en plataforma AM5',
      };
    }
  }, [ramSlot, statusMode]);

  // Dynamic Status Evaluation for GPU
  const gpuStatus: ComponentStatusEvaluation = useMemo(() => {
    const tdp = gpuSlot?.component.tdpWattage || 160;
    const name = gpuSlot?.component.name || 'Tarjeta Gráfica';

    if (statusMode === 'compatibility') {
      return {
        status: 'optimal',
        colorHex: '#10b981', // Emerald green
        badgeText: 'CLEARANCE & ENLACE VERIFICADO',
        detailText: 'Longitud de tarjeta: 281mm instalada en chasis con 365mm disponibles (+84mm margen libre).',
        metricLabel: 'FACTOR DE FORMA',
        metricValue: '2.5 Slots PCIe / 281 mm',
        interfaceBus: 'PCIe 4.0 x16 Nativo (64 GB/s)',
        clearanceNote: 'Sin interferencia con bahías frontales o radiadores AIO',
      };
    } else if (statusMode === 'thermal') {
      if (tdp >= 220) {
        return {
          status: 'attention',
          colorHex: '#f59e0b', // Amber
          badgeText: 'ALTA DISIPACIÓN TÉRMICA GPU',
          detailText: `Disipación de ${tdp}W requiere flujo de aire positivo y extracción posterior constante.`,
          metricLabel: 'CONSUMO ENERGÉTICO',
          metricValue: `${tdp} Watts TGP / 16-Pin`,
          interfaceBus: 'Ventiladores triples axiales activos',
          clearanceNote: 'Cámara de aire inferior libre de obstrucción',
        };
      }
      return {
        status: 'optimal',
        colorHex: '#10b981',
        badgeText: 'TEMPERATURA CONTROLADA',
        detailText: `TDP térmico eficiente de ${tdp}W con ventilación dual/triple en reposo acústico.`,
        metricLabel: 'CONSUMO TÉRMICO',
        metricValue: `${tdp} Watts TGP`,
        interfaceBus: 'Conector 1x 8-Pin PCIe Estándar',
        clearanceNote: 'Margen térmico excelente en compartimento principal',
      };
    } else {
      // performance mode
      return {
        status: 'high_performance',
        colorHex: '#0050cc', // Cobalt blue
        badgeText: 'ENLACE COMPLETO PCIe x16',
        detailText: '16 Líneas completas Gen 4 directamente comunicadas con el procesador (64 GB/s).',
        metricLabel: 'VELOCIDAD INTERFAZ',
        metricValue: 'PCIe Gen 4.0 @ x16',
        interfaceBus: name.includes('4070') ? '192-bit GDDR6X (504 GB/s)' : '128-bit GDDR6 (288 GB/s)',
        clearanceNote: 'Soporte Resizable BAR / SAM habilitado',
      };
    }
  }, [gpuSlot, statusMode]);

  // Color helper function based on component key
  const getStatusColor = (key: 'cpu' | 'gpu' | 'ram') => {
    if (key === 'cpu') return cpuStatus.colorHex;
    if (key === 'gpu') return gpuStatus.colorHex;
    return ramStatus.colorHex;
  };

  const getStatusObj = (key: 'cpu' | 'gpu' | 'ram') => {
    if (key === 'cpu') return cpuStatus;
    if (key === 'gpu') return gpuStatus;
    return ramStatus;
  };

  // Currently focused component details
  const focusedComponentData = useMemo(() => {
    if (selectedComponent === 'cpu') {
      return {
        type: 'cpu' as const,
        slot: cpuSlot,
        title: cpuSlot?.component.name || 'Procesador Central',
        code: 'SLOT-01 / CPU_SOCKET_AM5',
        statusObj: cpuStatus,
        locationCoordinate: 'X: 370mm | Y: 135mm | Z: Capa Superior PCB',
        dimensions: '40.0 x 40.0 mm (Paquete IHS)',
      };
    }
    if (selectedComponent === 'gpu') {
      return {
        type: 'gpu' as const,
        slot: gpuSlot,
        title: gpuSlot?.component.name || 'Acelerador Gráfico Dedicado',
        code: 'SLOT-04 / PCIE_16X_PRIMARY',
        statusObj: gpuStatus,
        locationCoordinate: 'X: 235mm | Y: 280mm | Z: Bahía de Expansión 1-2',
        dimensions: '281 x 114 x 42 mm (2.5 Slots)',
      };
    }
    if (selectedComponent === 'ram') {
      return {
        type: 'ram' as const,
        slot: ramSlot,
        title: ramSlot?.component.name || 'Memoria de Acceso Aleatorio',
        code: 'SLOT-03 / DIMM_A2_B2_DUAL',
        statusObj: ramStatus,
        locationCoordinate: 'X: 470mm | Y: 110mm | Z: Ranuras 2 y 4 de Memoria',
        dimensions: '133.35 x 34.9 mm (DDR5 UDIMM)',
      };
    }
    return null;
  }, [selectedComponent, cpuSlot, gpuSlot, ramSlot, cpuStatus, gpuStatus, ramStatus]);

  return (
    <div className="border border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
      {/* 1. CABECERA TÉCNICA SUgeneris CON CONTROLADORES DE TELEMETRÍA */}
      <div className="bg-[#121519] border-b border-black text-white p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase bg-[#0050cc] text-white px-2 py-0.5 font-bold tracking-wider">
                ESQUEMA ARQUITECTÓNICO SVG
              </span>
              <span className="font-mono text-[10px] uppercase text-[#889098] tracking-wider font-semibold">
                CAD CHASSIS INTEGRATION V4.1
              </span>
              <span className="font-mono text-[10px] text-[#10b981] flex items-center gap-1 font-bold">
                <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                MAPEO DE POSICIONAMIENTO EN VIVO
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-[20px] sm:text-[24px] uppercase font-bold text-white tracking-tight">
              Esquema Representativo del Chasis & Componentes
            </h2>
            <p className="font-sans text-[12px] text-[#a0a8b0] max-w-2xl mt-0.5">
              Inspección estructural bidimensional del chasis ATX. Identificación y evaluación de estatus en tiempo real de los componentes centrales: <strong className="text-white">Procesador (CPU)</strong>, <strong className="text-white">Tarjeta de Video (GPU)</strong> y <strong className="text-white">Memoria RAM</strong>.
            </p>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#1b2027] p-1.5 border border-[#303642] self-start lg:self-center">
            <span className="font-mono text-[10px] uppercase text-[#707884] px-2 font-bold hidden sm:inline-block">
              ENFOQUE:
            </span>
            <button
              onClick={() => setSelectedComponent('all')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase font-bold transition-all cursor-pointer ${
                selectedComponent === 'all'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-[#c0c8d0] hover:text-white hover:bg-[#252c38]'
              }`}
            >
              Vista Global
            </button>
            <button
              onClick={() => setSelectedComponent('cpu')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedComponent === 'cpu'
                  ? 'bg-[#0050cc] text-white shadow-xs'
                  : 'text-[#c0c8d0] hover:text-white hover:bg-[#252c38]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: cpuStatus.colorHex }}
              ></span>
              CPU
            </button>
            <button
              onClick={() => setSelectedComponent('gpu')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedComponent === 'gpu'
                  ? 'bg-[#0050cc] text-white shadow-xs'
                  : 'text-[#c0c8d0] hover:text-white hover:bg-[#252c38]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: gpuStatus.colorHex }}
              ></span>
              GPU
            </button>
            <button
              onClick={() => setSelectedComponent('ram')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedComponent === 'ram'
                  ? 'bg-[#0050cc] text-white shadow-xs'
                  : 'text-[#c0c8d0] hover:text-white hover:bg-[#252c38]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: ramStatus.colorHex }}
              ></span>
              RAM
            </button>
          </div>
        </div>

        {/* Barra Secundaria de Modo de Estatus & Toggles de Vista */}
        <div className="mt-4 pt-3 border-t border-[#232934] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-[#889098] font-bold">
              MODO EVALUACIÓN DE ESTATUS:
            </span>
            <div className="inline-flex border border-[#384152] bg-[#161a21] p-0.5">
              <button
                onClick={() => setStatusMode('compatibility')}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  statusMode === 'compatibility'
                    ? 'bg-[#10b981] text-black font-extrabold'
                    : 'text-[#909aa6] hover:text-white'
                }`}
              >
                1. Compatibilidad & Clearance
              </button>
              <button
                onClick={() => setStatusMode('thermal')}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  statusMode === 'thermal'
                    ? 'bg-[#f59e0b] text-black font-extrabold'
                    : 'text-[#909aa6] hover:text-white'
                }`}
              >
                2. Perfil Térmico / TDP
              </button>
              <button
                onClick={() => setStatusMode('performance')}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  statusMode === 'performance'
                    ? 'bg-[#0050cc] text-white font-extrabold'
                    : 'text-[#909aa6] hover:text-white'
                }`}
              >
                3. Interfaz & Bus PCIe/RAM
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[10px] text-[#c0c8d0] uppercase select-none">
              <input
                type="checkbox"
                checked={showDimensions}
                onChange={(e) => setShowDimensions(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#0050cc]"
              />
              Regla Milimétrica (mm)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[10px] text-[#c0c8d0] uppercase select-none">
              <input
                type="checkbox"
                checked={showAirflowVectors}
                onChange={(e) => setShowAirflowVectors(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#0050cc]"
              />
              Vectores Flujo de Aire
            </label>
          </div>
        </div>

        {/* Barra Terciaria: Control Integrado de Iluminación Ambiental ARGB */}
        <div className="mt-3 pt-3 border-t border-[#232934] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-[#889098] font-bold flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-xs transition-colors"
                style={{ backgroundColor: activeEffect === 'off' ? '#444' : activeColor }}
              ></span>
              ILUMINACIÓN AMBIENTAL ARGB:
            </span>
            <span className="font-mono text-[10px] text-white font-bold bg-[#1a202c] px-2 py-0.5 border border-[#303846]">
              {currentColorName}
            </span>

            {/* Swatches de color */}
            <div className="flex items-center gap-1.5 bg-[#161a21] p-1 border border-[#303642]">
              {AMBIENT_COLOR_PRESETS.map((preset) => {
                const isSelected = activeEffect !== 'off' && activeColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    title={`${preset.name} (${preset.hex})`}
                    onClick={() => {
                      if (preset.id === 'stealth') {
                        setActiveEffect('off');
                      } else {
                        setActiveColor(preset.hex);
                        if (activeEffect === 'off') setActiveEffect('static');
                      }
                    }}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer border ${
                      isSelected
                        ? 'scale-125 border-white ring-2 ring-white/50'
                        : 'border-black/50 hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                  />
                );
              })}

              {/* Selector de color HEX nativo */}
              <label
                title="Elegir color personalizado HEX"
                className="relative w-4 h-4 rounded-full cursor-pointer overflow-hidden border border-white/50 flex items-center justify-center hover:scale-110 transition-transform bg-gradient-to-tr from-indigo-500 via-pink-500 to-yellow-400"
              >
                <input
                  type="color"
                  value={activeColor.startsWith('#') && activeColor.length === 7 ? activeColor : '#0050cc'}
                  onChange={(e) => {
                    setActiveColor(e.target.value);
                    if (activeEffect === 'off') setActiveEffect('static');
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

          {/* Selector de Modo de Efecto y Brillo */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex border border-[#384152] bg-[#161a21] p-0.5 text-[9px] font-mono uppercase font-bold">
              {(['static', 'pulse', 'breathing', 'rainbow', 'off'] as LightingEffect[]).map((ef) => (
                <button
                  key={ef}
                  type="button"
                  onClick={() => setActiveEffect(ef)}
                  className={`px-2 py-0.5 transition-colors cursor-pointer ${
                    activeEffect === ef
                      ? 'bg-[#0050cc] text-white font-extrabold'
                      : 'text-[#909aa6] hover:text-white'
                  }`}
                >
                  {ef === 'static'
                    ? 'Estático'
                    : ef === 'pulse'
                    ? 'Pulso'
                    : ef === 'breathing'
                    ? 'Respiración'
                    : ef === 'rainbow'
                    ? 'Arcoíris'
                    : 'Apagado'}
                </button>
              ))}
            </div>

            {activeEffect !== 'off' && (
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#889098]">
                <span>BRILLO:</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={activeBrightness}
                  onChange={(e) => setActiveBrightness(Number(e.target.value))}
                  className="w-16 h-1 accent-[#0050cc] cursor-pointer"
                />
                <span className="text-white font-bold w-6">{activeBrightness}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ÁREA DE DIBUJO TÉCNICO CAD SVG (CANVAS) */}
      <div className="relative bg-[#0d1015] w-full overflow-x-auto select-none">
        {/* Leyenda flotante de status */}
        <div className="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3 bg-[#151921]/90 backdrop-blur-xs border border-[#2d3542] px-3 py-1.5 text-[10px] font-mono text-white pointer-events-none">
          <span className="text-[#889098] uppercase font-bold">ESTATUS VIGENTE:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block"></span>
            <span className="text-[#10b981] font-bold">Verde</span> = Óptimo / Compatible
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0050cc] inline-block"></span>
            <span className="text-[#60a5fa] font-bold">Azul</span> = Alto Rendimiento / Boost
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block"></span>
            <span className="text-[#f59e0b] font-bold">Ámbar</span> = Alta Demanda Térmica
          </span>
          <span className="flex items-center gap-1.5 pl-2 border-l border-[#3a4454]">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
              style={{ backgroundColor: activeEffect === 'off' ? '#444' : activeColor }}
            ></span>
            <span className="text-white font-bold">ARGB Chasis:</span>
            <span className="text-[#38bdf8] font-mono">{currentColorName}</span>
          </span>
        </div>

        {/* Interactive SVG Diagram */}
        <div className="min-w-[820px] max-w-full mx-auto p-2 sm:p-4">
          <svg
            viewBox="0 0 940 620"
            className="w-full h-auto"
            style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }}
          >
            <defs>
              {/* Keyframe styles for ARGB dynamic effects */}
              <style>{`
                @keyframes ambientPulse {
                  0%, 100% { opacity: ${effectiveOpacity}; }
                  50% { opacity: ${Math.max(0.12, effectiveOpacity * 0.35)}; }
                }
                @keyframes ambientBreathing {
                  0%, 100% { opacity: ${effectiveOpacity}; }
                  50% { opacity: ${Math.max(0.18, effectiveOpacity * 0.45)}; }
                }
                @keyframes rainbowCycle {
                  0% { filter: hue-rotate(0deg); }
                  100% { filter: hue-rotate(360deg); }
                }
                .ambient-pulse-fx {
                  animation: ambientPulse 2.4s ease-in-out infinite;
                }
                .ambient-breathing-fx {
                  animation: ambientBreathing 4.2s ease-in-out infinite;
                }
                .ambient-rainbow-fx {
                  animation: rainbowCycle 5.5s linear infinite;
                }
              `}</style>

              {/* CAD Grid pattern */}
              <pattern id="cadGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#161b24" strokeWidth="0.5" />
              </pattern>
              <pattern id="cadGridBig" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#cadGridSmall)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#232a38" strokeWidth="1" />
              </pattern>

              {/* Status Glow Filters */}
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Ambient ARGB Glow Filter */}
              <filter id="ambientGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Rainbow Spectrum Gradient */}
              <linearGradient id="argbRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="20%" stopColor="#f59e0b" />
                <stop offset="40%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#06b6d4" />
                <stop offset="80%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              {/* Internal Chamber Ambient Wash Radial Gradient */}
              <radialGradient id="chassisInternalAmbientGlow" cx="45%" cy="38%" r="62%">
                <stop
                  offset="0%"
                  stopColor={activeEffect === 'rainbow' ? '#06b6d4' : activeColor}
                  stopOpacity={activeEffect === 'off' ? 0 : 0.3 * (activeBrightness / 100)}
                />
                <stop
                  offset="60%"
                  stopColor={activeEffect === 'rainbow' ? '#8b5cf6' : activeColor}
                  stopOpacity={activeEffect === 'off' ? 0 : 0.12 * (activeBrightness / 100)}
                />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Linear Gradients */}
              <linearGradient id="chassisSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e222a" />
                <stop offset="100%" stopColor="#14171d" />
              </linearGradient>

              <linearGradient id="moboPcb" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#191c22" />
                <stop offset="100%" stopColor="#121418" />
              </linearGradient>

              {/* CPU IHS Metallic Gradient */}
              <linearGradient id="cpuIhsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d8dde3" />
                <stop offset="50%" stopColor="#9da6b2" />
                <stop offset="100%" stopColor="#697482" />
              </linearGradient>

              {/* RAM Heatspreader Gradient */}
              <linearGradient id="ramStickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2c323d" />
                <stop offset="50%" stopColor="#1c2027" />
                <stop offset="100%" stopColor="#14171d" />
              </linearGradient>

              {/* GPU Backplate Gradient */}
              <linearGradient id="gpuBackplateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#252a33" />
                <stop offset="50%" stopColor="#1e222a" />
                <stop offset="100%" stopColor="#161920" />
              </linearGradient>

              {/* Arrow Marker for Airflow */}
              <marker
                id="cadAirflowBlue"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker
                id="cadAirflowWarm"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
              </marker>
            </defs>

            {/* BACKGROUND CAD GRID */}
            <rect width="940" height="620" fill="url(#cadGridBig)" />

            {/* ============================================================== */}
            {/* 1. CHASSIS OUTER SHELL & ARCHITECTURAL FRAME (Mid-Tower ATX) */}
            {/* ============================================================== */}
            {/* Main Outer Steel Chassis Contour (460mm x 480mm scale) */}
            <rect
              x="60"
              y="30"
              width="820"
              height="550"
              fill="url(#chassisSteel)"
              stroke="#3a4250"
              strokeWidth="2.5"
              rx="6"
            />

            {/* AMBIENT CHASSIS INTERNAL CAVITY WASH (ARGB BACKLIGHT GLOW) */}
            <rect
              x="85"
              y="60"
              width="695"
              height="388"
              rx="4"
              fill="url(#chassisInternalAmbientGlow)"
              pointerEvents="none"
              className={lightingAnimationClass}
            />

            {/* Outer Bevel Corner Fasteners */}
            {[
              { cx: 70, cy: 40 },
              { cx: 870, cy: 40 },
              { cx: 70, cy: 570 },
              { cx: 870, cy: 570 },
            ].map((screw, i) => (
              <circle
                key={i}
                cx={screw.cx}
                cy={screw.cy}
                r="3"
                fill="#111317"
                stroke="#64748b"
                strokeWidth="1"
              />
            ))}

            {/* FRONT PANEL / INTAKE BAY (RIGHT SIDE IN PROFILE / FRONT CHASSIS) */}
            {/* Front Panel Mesh & Frame (Right Side x: 800 - 870) */}
            <rect
              x="800"
              y="35"
              width="70"
              height="540"
              fill="#181c22"
              stroke="#323945"
              strokeWidth="1.5"
            />
            {/* Front Mesh Pattern Perforations */}
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="810"
                y1={55 + i * 21}
                x2="860"
                y2={55 + i * 21}
                stroke="#3f4857"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            ))}
            {/* Front 3x 120mm Intake Fans with ARGB Halo Rings */}
            {[
              { y: 65, label: 'VENTILADOR FRONTAL 1 (SUPERIOR)' },
              { y: 195, label: 'VENTILADOR FRONTAL 2 (CENTRAL - GPU DIRECTO)' },
              { y: 325, label: 'VENTILADOR FRONTAL 3 (INFERIOR - PSU/CAJAS)' },
            ].map((fan, i) => (
              <g key={i}>
                {/* Front Fan Outer ARGB Halo Glow */}
                <circle
                  cx="791"
                  cy={fan.y + 57.5}
                  r="52"
                  fill="none"
                  stroke={effectiveLightingFill}
                  strokeWidth="3.5"
                  opacity={effectiveOpacity}
                  filter={activeEffect !== 'off' ? 'url(#ambientGlowFilter)' : undefined}
                  className={lightingAnimationClass}
                />
                <circle
                  cx="791"
                  cy={fan.y + 57.5}
                  r="52"
                  fill="none"
                  stroke={activeEffect === 'off' ? '#2d3748' : '#ffffff'}
                  strokeWidth="1"
                  opacity={activeEffect === 'off' ? 0.2 : 0.6}
                />

                <rect
                  x="782"
                  y={fan.y}
                  width="18"
                  height="115"
                  fill="#222832"
                  stroke="#4b5563"
                  strokeWidth="1"
                  rx="2"
                />
                <circle
                  cx="791"
                  cy={fan.y + 57.5}
                  r="16"
                  fill="#14171d"
                  stroke={activeEffect === 'off' ? '#0050cc' : effectiveLightingFill}
                  strokeWidth={activeEffect === 'off' ? '1' : '2'}
                  className={lightingAnimationClass}
                />
                <circle
                  cx="791"
                  cy={fan.y + 57.5}
                  r="5"
                  fill={activeEffect === 'off' ? '#38bdf8' : effectiveLightingFill}
                  className={lightingAnimationClass}
                />
                {/* Fan spinning vector hint */}
                <path
                  d={`M 788 ${fan.y + 35} Q 794 ${fan.y + 57.5} 788 ${fan.y + 80}`}
                  stroke={activeEffect === 'off' ? '#38bdf8' : effectiveLightingFill}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  fill="none"
                  className={lightingAnimationClass}
                />
              </g>
            ))}

            {/* TOP EXHAUST & RADIATOR RAILS (y: 35 - 65) */}
            <rect
              x="80"
              y="35"
              width="690"
              height="25"
              fill="#161920"
              stroke="#2e3542"
              strokeWidth="1"
            />
            {/* Top fan mounting slotted vents */}
            {Array.from({ length: 20 }).map((_, i) => (
              <rect
                key={i}
                x={100 + i * 32}
                y="41"
                width="22"
                height="12"
                rx="2"
                fill="#0e1116"
                stroke="#2a313d"
                strokeWidth="0.8"
              />
            ))}
            <text x="380" y="51" fill="#717d8e" fontFamily="monospace" fontSize="8" fontWeight="bold" letterSpacing="1">
              RIEL DE MONTAJE SUPERIOR // RADIADOR 240MM / 360MM
            </text>

            {/* TOP ARGB LIGHT STRIP DIFFUSER & LED DIODES */}
            <g className={lightingAnimationClass}>
              <rect
                x="85"
                y="61"
                width="685"
                height="5"
                rx="2.5"
                fill={effectiveLightingFill}
                opacity={effectiveOpacity}
                filter={activeEffect !== 'off' ? 'url(#ambientGlowFilter)' : undefined}
              />
              <rect
                x="85"
                y="62"
                width="685"
                height="2"
                rx="1"
                fill={activeEffect === 'off' ? '#262c36' : '#ffffff'}
                opacity={activeEffect === 'off' ? 0.3 : 0.85}
              />
              {Array.from({ length: 24 }).map((_, i) => (
                <circle
                  key={i}
                  cx={100 + i * 28}
                  cy="63.5"
                  r="1.6"
                  fill={effectiveLightingFill}
                  opacity={activeEffect === 'off' ? 0.2 : 0.95}
                />
              ))}
            </g>

            {/* REAR I/O & EXHAUST AREA (LEFT SIDE x: 65 - 130) */}
            {/* Rear 120mm Exhaust Fan with ARGB Halo Ring */}
            <g>
              {/* Rear Fan ARGB Outer Halo Glow */}
              <circle
                cx="92"
                cy="167.5"
                r="50"
                fill="none"
                stroke={effectiveLightingFill}
                strokeWidth="3.5"
                opacity={effectiveOpacity}
                filter={activeEffect !== 'off' ? 'url(#ambientGlowFilter)' : undefined}
                className={lightingAnimationClass}
              />
              <circle
                cx="92"
                cy="167.5"
                r="50"
                fill="none"
                stroke={activeEffect === 'off' ? '#2d3748' : '#ffffff'}
                strokeWidth="1"
                opacity={activeEffect === 'off' ? 0.2 : 0.6}
              />

              <rect
                x="80"
                y="110"
                width="24"
                height="115"
                fill="#222832"
                stroke="#4b5563"
                strokeWidth="1"
                rx="2"
              />
              <circle
                cx="92"
                cy="167.5"
                r="16"
                fill="#14171d"
                stroke={activeEffect === 'off' ? '#f97316' : effectiveLightingFill}
                strokeWidth={activeEffect === 'off' ? '1' : '2'}
                className={lightingAnimationClass}
              />
              <circle
                cx="92"
                cy="167.5"
                r="5"
                fill={activeEffect === 'off' ? '#f97316' : effectiveLightingFill}
                className={lightingAnimationClass}
              />
              <text x="70" y="102" fill="#8b95a5" fontFamily="monospace" fontSize="8" transform="rotate(-90 70 102)">
                EXTRACCIÓN TRASERA 120MM
              </text>
            </g>

            {/* Rear Motherboard I/O Shield Cutout */}
            <rect
              x="75"
              y="75"
              width="45"
              height="30"
              fill="#101317"
              stroke="#3e4655"
              strokeWidth="1"
            />
            <text x="80" y="93" fill="#606c7d" fontFamily="monospace" fontSize="7" fontWeight="bold">
              I/O SHIELD
            </text>

            {/* Rear Expansion Slot Brackets (PCIe Slots 1 to 7) */}
            {Array.from({ length: 7 }).map((_, i) => (
              <g key={i}>
                <rect
                  x="70"
                  y={260 + i * 22}
                  width="50"
                  height="18"
                  fill={i === 1 || i === 2 ? '#1f2530' : '#14171d'}
                  stroke={i === 1 || i === 2 ? '#3b82f6' : '#28303c'}
                  strokeWidth="1"
                />
                <circle cx="78" cy={269 + i * 22} r="2" fill="#505a6a" />
                <text x="90" y={273 + i * 22} fill="#626e80" fontFamily="monospace" fontSize="7">
                  SLOT #{i + 1}
                </text>
              </g>
            ))}

            {/* ============================================================== */}
            {/* 2. PSU BASEMENT & POWER SHROUD (BOTTOM COMPARTMENT) */}
            {/* ============================================================== */}
            <rect
              x="65"
              y="450"
              width="810"
              height="125"
              fill="#111317"
              stroke="#2e3542"
              strokeWidth="1.5"
            />

            {/* PSU Shroud ARGB Accent Light Pipe */}
            <g className={lightingAnimationClass}>
              <rect
                x="65"
                y="449"
                width="810"
                height="4.5"
                fill={effectiveLightingFill}
                opacity={effectiveOpacity}
                filter={activeEffect !== 'off' ? 'url(#ambientGlowFilter)' : undefined}
              />
              <rect
                x="65"
                y="450"
                width="810"
                height="2"
                fill={activeEffect === 'off' ? '#262c36' : '#ffffff'}
                opacity={activeEffect === 'off' ? 0.3 : 0.8}
              />
              {/* Illuminated ARGB Sync Badge on Shroud */}
              <g transform="translate(670, 458)">
                <rect
                  x="0"
                  y="0"
                  width="195"
                  height="18"
                  fill="#0c0e12"
                  stroke={effectiveLightingFill}
                  strokeWidth="1"
                  rx="2"
                  opacity={activeEffect === 'off' ? 0.4 : 0.95}
                />
                <circle
                  cx="10"
                  cy="9"
                  r="3"
                  fill={effectiveLightingFill}
                />
                <text
                  x="18"
                  y="12.5"
                  fill={activeEffect === 'off' ? '#717d8e' : (activeEffect === 'rainbow' ? '#38bdf8' : activeColor)}
                  fontFamily="monospace"
                  fontSize="7.5"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  NOVA CORE // ARGB SYNC
                </text>
              </g>
            </g>

            {/* Shroud Ventilation Grille */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1={380 + i * 16}
                y1="460"
                x2={380 + i * 16}
                y2="475"
                stroke="#252c38"
                strokeWidth="2"
              />
            ))}
            <text x="400" y="470" fill="#717d8e" fontFamily="monospace" fontSize="8" fontWeight="bold">
              CÁMARA TÉRMICA PSU // BAHÍA INDEPENDIENTE
            </text>

            {/* PSU Body (Power Supply Unit) */}
            <rect
              x="90"
              y="480"
              width="210"
              height="80"
              fill="#1a1e26"
              stroke="#434c5b"
              strokeWidth="1.5"
              rx="3"
            />
            <circle cx="195" cy="520" r="28" fill="#13151a" stroke="#2c3340" strokeWidth="1" />
            <circle cx="195" cy="520" r="8" fill="#374151" />
            <text x="105" y="505" fill="#f3f4f6" fontFamily="monospace" fontSize="10" fontWeight="bold">
              {psuSlot?.component.name || 'EVGA 750W ATX 3.0'}
            </text>
            <text x="105" y="522" fill="#9ca3af" fontFamily="monospace" fontSize="8">
              80+ GOLD CERTIFIED • MODULAR
            </text>
            <text x="105" y="538" fill="#10b981" fontFamily="monospace" fontSize="8" fontWeight="bold">
              LÍNEA 12V-2x6 & ATX 24P LISTA
            </text>

            {/* Storage Drive Cages in Basement (Right side of PSU) */}
            <rect
              x="640"
              y="480"
              width="140"
              height="80"
              fill="#181c24"
              stroke="#313947"
              strokeWidth="1"
              rx="2"
            />
            <text x="655" y="505" fill="#717d8e" fontFamily="monospace" fontSize="8" fontWeight="bold">
              JAULA DE DISCOS 2.5"/3.5"
            </text>
            <line x1="650" y1="520" x2="770" y2="520" stroke="#252d3a" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="650" y1="540" x2="770" y2="540" stroke="#252d3a" strokeWidth="1" strokeDasharray="3,2" />

            {/* Cable Pass-Through Grommets (Rubber grommets with cables) */}
            {[
              { x: 745, y: 160, h: 70 },
              { x: 745, y: 280, h: 60 },
              { x: 580, y: 442, w: 70, h: 16 },
            ].map((grommet, i) => (
              <g key={i}>
                <rect
                  x={grommet.x}
                  y={grommet.y}
                  width={grommet.w || 16}
                  height={grommet.h}
                  rx="6"
                  fill="#0b0d11"
                  stroke="#2d3542"
                  strokeWidth="1.2"
                />
                <line
                  x1={grommet.x + (grommet.w ? grommet.w / 2 : 8)}
                  y1={grommet.y + 4}
                  x2={grommet.x + (grommet.w ? grommet.w / 2 : 8)}
                  y2={grommet.y + grommet.h - 4}
                  stroke="#1a1e27"
                  strokeWidth="3"
                />
              </g>
            ))}

            {/* ============================================================== */}
            {/* 3. MOTHERBOARD PCB TRAY (ATX 305mm x 244mm scaled) */}
            {/* ============================================================== */}
            <g id="motherboard-tray">
              {/* Motherboard PCB Outline (x: 160, y: 70, width: 570, height: 370) */}
              <rect
                x="160"
                y="70"
                width="570"
                height="370"
                fill="url(#moboPcb)"
                stroke="#374151"
                strokeWidth="1.5"
                rx="4"
              />

              {/* Motherboard Right-Edge ARGB Underglow Light Bar */}
              <rect
                x="725"
                y="75"
                width="6"
                height="360"
                rx="3"
                fill={effectiveLightingFill}
                opacity={effectiveOpacity * 0.9}
                filter={activeEffect !== 'off' ? 'url(#ambientGlowFilter)' : undefined}
                className={lightingAnimationClass}
              />

              {/* Motherboard Model Silkscreen & Logo */}
              <text x="180" y="95" fill="#4b5563" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="bold">
                {moboSlot?.component.name || 'MSI MAG B650 TOMAHAWK WIFI'}
              </text>
              <text x="180" y="110" fill="#374151" fontFamily="monospace" fontSize="8" fontWeight="bold">
                ATX FORM FACTOR • 6-LAYER PCB • 2oz COPPER TRACES
              </text>

              {/* Motherboard Brass Standoffs (M1 to M9) */}
              {[
                { x: 180, y: 85 },
                { x: 440, y: 85 },
                { x: 710, y: 85 },
                { x: 180, y: 250 },
                { x: 440, y: 250 },
                { x: 710, y: 250 },
                { x: 180, y: 420 },
                { x: 440, y: 420 },
                { x: 710, y: 420 },
              ].map((standoff, i) => (
                <circle
                  key={i}
                  cx={standoff.x}
                  cy={standoff.y}
                  r="4"
                  fill="#b45309"
                  stroke="#d97706"
                  strokeWidth="1"
                />
              ))}

              {/* VRM Extended Heatsinks (Top & Left of CPU Socket) */}
              {/* Top VRM Fin Array */}
              <rect
                x="280"
                y="78"
                width="190"
                height="40"
                fill="#20252e"
                stroke="#3b4453"
                strokeWidth="1"
                rx="2"
              />
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1={290 + i * 14} y1="82" x2={290 + i * 14} y2="114" stroke="#2e3644" strokeWidth="2" />
              ))}
              <text x="295" y="102" fill="#717d8e" fontFamily="monospace" fontSize="8" fontWeight="bold">
                VRM FASES (14+2+1 80A)
              </text>

              {/* Left VRM / I/O Heatsink Shield */}
              <rect
                x="175"
                y="115"
                width="70"
                height="130"
                fill="#20252e"
                stroke="#3b4453"
                strokeWidth="1"
                rx="2"
              />
              <text x="182" y="160" fill="#717d8e" fontFamily="monospace" fontSize="8" fontWeight="bold" transform="rotate(-90 182 160)">
                I/O SHIELD HEATSINK
              </text>

              {/* M.2 Shield Frozr (NVMe Gen 4 Heatsink between CPU and GPU) */}
              <rect
                x="270"
                y="235"
                width="170"
                height="22"
                fill="#1f242d"
                stroke="#3b4453"
                strokeWidth="1"
                rx="2"
              />
              <text x="280" y="250" fill="#9ca3af" fontFamily="monospace" fontSize="8" fontWeight="bold">
                M.2_1 NVMe PCIe 4.0 x4 [KINGSTON KC3000]
              </text>

              {/* Chipset Heatsink (Bottom right of motherboard) */}
              <rect
                x="600"
                y="340"
                width="110"
                height="70"
                fill="#20252e"
                stroke="#3b4453"
                strokeWidth="1"
                rx="2"
              />
              <text x="615" y="375" fill="#717d8e" fontFamily="monospace" fontSize="9" fontWeight="bold">
                B650 CHIPSET
              </text>
              <text x="615" y="390" fill="#4b5563" fontFamily="monospace" fontSize="7">
                THERMAL DISSIPATOR
              </text>
            </g>

            {/* ============================================================== */}
            {/* 4. COMPONENT 01: CPU (PROCESADOR) - HIGH PRECISION HIGHLIGHT */}
            {/* ============================================================== */}
            <g
              id="component-cpu"
              onClick={() => setSelectedComponent('cpu')}
              onMouseEnter={() => setHoveredComponent('cpu')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer transition-all duration-200"
            >
              {/* Interactive Status Halo / Glow */}
              <rect
                x="330"
                y="125"
                width="110"
                height="105"
                rx="6"
                fill={selectedComponent === 'cpu' || hoveredComponent === 'cpu' ? `${cpuStatus.colorHex}22` : 'transparent'}
                stroke={getStatusColor('cpu')}
                strokeWidth={selectedComponent === 'cpu' || hoveredComponent === 'cpu' ? '3' : '2'}
                strokeDasharray={selectedComponent === 'cpu' ? 'none' : '4,2'}
                style={{
                  filter: selectedComponent === 'cpu' ? `drop-shadow(0 0 10px ${cpuStatus.colorHex})` : undefined,
                }}
              />

              {/* Socket AM5 Bracket Frame */}
              <rect
                x="340"
                y="132"
                width="90"
                height="90"
                fill="#161a22"
                stroke="#475569"
                strokeWidth="1.5"
                rx="4"
              />

              {/* Socket retention latch lever */}
              <path d="M 432 135 L 436 135 L 436 215 L 432 215" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
              <circle cx="436" cy="175" r="3" fill="#cbd5e1" />

              {/* CPU Package Substrate (Dark Green / PCB with gold alignment dot) */}
              <rect
                x="347"
                y="140"
                width="74"
                height="74"
                fill="#122a1f"
                stroke="#15803d"
                strokeWidth="1"
                rx="2"
              />
              <polygon points="349,142 355,142 349,148" fill="#eab308" />

              {/* Integrated Heat Spreader (IHS) - Nickel Plated Metallic Block */}
              <rect
                x="353"
                y="146"
                width="62"
                height="62"
                fill="url(#cpuIhsGrad)"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                rx="3"
              />

              {/* Zen 4 / Intel IHS Octagonal Cutouts / Capacitor Notch */}
              <rect x="353" y="165" width="4" height="24" fill="#122a1f" />
              <rect x="411" y="165" width="4" height="24" fill="#122a1f" />
              <rect x="372" y="146" width="24" height="4" fill="#122a1f" />
              <rect x="372" y="204" width="24" height="4" fill="#122a1f" />

              {/* CPU Brand Engraving */}
              <text x="360" y="172" fill="#0f172a" fontFamily="monospace" fontSize="8" fontWeight="bold">
                {cpuSlot?.component.name.includes('Intel') ? 'INTEL' : 'AMD RYZEN'}
              </text>
              <text x="360" y="184" fill="#0f172a" fontFamily="monospace" fontSize="7" fontWeight="bold">
                {cpuSlot?.component.name.replace(/AMD |Intel /g, '').slice(0, 10)}
              </text>
              <text x="360" y="196" fill="#334155" fontFamily="monospace" fontSize="6.5">
                SOCKET AM5
              </text>

              {/* Pulsing Status Dot on CPU */}
              <circle cx="360" cy="149" r="4" fill={getStatusColor('cpu')}>
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Floating Status Badge Tag for CPU */}
              <g transform="translate(320, 95)">
                <rect
                  x="0"
                  y="0"
                  width="135"
                  height="22"
                  fill="#000000"
                  stroke={getStatusColor('cpu')}
                  strokeWidth="1.5"
                  rx="3"
                />
                <circle cx="10" cy="11" r="3.5" fill={getStatusColor('cpu')} />
                <text x="18" y="14" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="bold">
                  CPU: {cpuStatus.badgeText.split('/')[0].trim()}
                </text>
              </g>

              {/* Optional Cooler Outline (translucent so CPU is visible) */}
              <rect
                x="320"
                y="118"
                width="130"
                height="120"
                fill="none"
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.4"
                rx="4"
              />
              <text x="325" y="234" fill="#94a3b8" fontFamily="monospace" fontSize="6.5" opacity="0.6">
                CONTORNO DISIPADOR // 160MM
              </text>
            </g>

            {/* ============================================================== */}
            {/* 5. COMPONENT 02: RAM (MEMORIA RAM DDR5) - HIGH PRECISION HIGHLIGHT */}
            {/* ============================================================== */}
            <g
              id="component-ram"
              onClick={() => setSelectedComponent('ram')}
              onMouseEnter={() => setHoveredComponent('ram')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer transition-all duration-200"
            >
              {/* Interactive Status Halo / Glow */}
              <rect
                x="470"
                y="95"
                width="105"
                height="160"
                rx="6"
                fill={selectedComponent === 'ram' || hoveredComponent === 'ram' ? `${ramStatus.colorHex}22` : 'transparent'}
                stroke={getStatusColor('ram')}
                strokeWidth={selectedComponent === 'ram' || hoveredComponent === 'ram' ? '3' : '2'}
                strokeDasharray={selectedComponent === 'ram' ? 'none' : '4,2'}
                style={{
                  filter: selectedComponent === 'ram' ? `drop-shadow(0 0 10px ${ramStatus.colorHex})` : undefined,
                }}
              />

              {/* 4 DIMM Slots Bank (A1, A2, B1, B2) */}
              {[
                { x: 480, name: 'DDR5_A1', populated: false },
                { x: 504, name: 'DDR5_A2', populated: true },
                { x: 528, name: 'DDR5_B1', populated: false },
                { x: 552, name: 'DDR5_B2', populated: true },
              ].map((dimm, i) => (
                <g key={i}>
                  {/* Slot socket base on motherboard */}
                  <rect
                    x={dimm.x}
                    y="105"
                    width="14"
                    height="140"
                    fill="#15181e"
                    stroke="#2e3542"
                    strokeWidth="1"
                    rx="1"
                  />

                  {/* Top and Bottom Locking Latches */}
                  <rect x={dimm.x + 1} y="103" width="12" height="6" fill={dimm.populated ? '#38bdf8' : '#334155'} rx="1" />
                  <rect x={dimm.x + 1} y="241" width="12" height="6" fill={dimm.populated ? '#38bdf8' : '#334155'} rx="1" />

                  {/* If Populated (Slots A2 and B2 for Optimal Dual-Channel) */}
                  {dimm.populated ? (
                    <g>
                      {/* RAM Stick Body / Heatspreader */}
                      <rect
                        x={dimm.x + 2}
                        y="110"
                        width="10"
                        height="130"
                        fill="url(#ramStickGrad)"
                        stroke="#64748b"
                        strokeWidth="0.8"
                        rx="1"
                      />

                      {/* Aluminum Fins Texture */}
                      {Array.from({ length: 8 }).map((_, fIdx) => (
                        <line
                          key={fIdx}
                          x1={dimm.x + 3}
                          y1={120 + fIdx * 12}
                          x2={dimm.x + 10}
                          y2={120 + fIdx * 12}
                          stroke="#384252"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Top Accent Strip / RGB Light Bar */}
                      <rect
                        x={dimm.x + 2}
                        y="110"
                        width="10"
                        height="8"
                        fill={getStatusColor('ram')}
                        rx="1"
                      />

                      {/* DDR5 Logo */}
                      <text
                        x={dimm.x + 9}
                        y="190"
                        fill="#94a3b8"
                        fontFamily="monospace"
                        fontSize="6"
                        fontWeight="bold"
                        transform={`rotate(-90 ${dimm.x + 9} 190)`}
                      >
                        DDR5
                      </text>
                    </g>
                  ) : (
                    /* Empty Slot Guide */
                    <line
                      x1={dimm.x + 7}
                      y1="112"
                      x2={dimm.x + 7}
                      y2="238"
                      stroke="#222834"
                      strokeWidth="2"
                    />
                  )}

                  {/* Slot label below */}
                  <text
                    x={dimm.x + 7}
                    y="253"
                    fill={dimm.populated ? '#e2e8f0' : '#475569'}
                    fontFamily="monospace"
                    fontSize="6"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {dimm.name.replace('DDR5_', '')}
                  </text>
                </g>
              ))}

              {/* Dual-Channel Bracket Line */}
              <path
                d="M 511 100 L 511 96 L 559 96 L 559 100"
                stroke={getStatusColor('ram')}
                strokeWidth="1.5"
                fill="none"
              />
              <text x="535" y="93" fill={getStatusColor('ram')} fontFamily="monospace" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                CANAL DUAL OPT. (A2 + B2)
              </text>

              {/* Floating Status Badge Tag for RAM */}
              <g transform="translate(480, 68)">
                <rect
                  x="0"
                  y="0"
                  width="135"
                  height="22"
                  fill="#000000"
                  stroke={getStatusColor('ram')}
                  strokeWidth="1.5"
                  rx="3"
                />
                <circle cx="10" cy="11" r="3.5" fill={getStatusColor('ram')} />
                <text x="18" y="14" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="bold">
                  RAM: {ramStatus.badgeText.split('/')[0].trim()}
                </text>
              </g>
            </g>

            {/* ============================================================== */}
            {/* 6. COMPONENT 03: GPU (TARJETA GRÁFICA) - HIGH PRECISION HIGHLIGHT */}
            {/* ============================================================== */}
            <g
              id="component-gpu"
              onClick={() => setSelectedComponent('gpu')}
              onMouseEnter={() => setHoveredComponent('gpu')}
              onMouseLeave={() => setHoveredComponent(null)}
              className="cursor-pointer transition-all duration-200"
            >
              {/* Interactive Status Halo / Glow */}
              <rect
                x="115"
                y="270"
                width="530"
                height="105"
                rx="6"
                fill={selectedComponent === 'gpu' || hoveredComponent === 'gpu' ? `${gpuStatus.colorHex}22` : 'transparent'}
                stroke={getStatusColor('gpu')}
                strokeWidth={selectedComponent === 'gpu' || hoveredComponent === 'gpu' ? '3' : '2'}
                strokeDasharray={selectedComponent === 'gpu' ? 'none' : '4,2'}
                style={{
                  filter: selectedComponent === 'gpu' ? `drop-shadow(0 0 10px ${gpuStatus.colorHex})` : undefined,
                }}
              />

              {/* PCIe x16 Motherboard Slot (Reinforced Steel Slot) */}
              <rect
                x="260"
                y="272"
                width="160"
                height="10"
                fill="#2c3340"
                stroke="#64748b"
                strokeWidth="1"
                rx="1"
              />
              <line x1="270" y1="277" x2="410" y2="277" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* PCIe Slot Lock Retention Lever */}
              <polygon points="418,272 428,272 428,282 422,282" fill="#38bdf8" />

              {/* GPU Rear Metal Bracket (Connected to Chassis I/O Expansion slots 2 & 3) */}
              <rect
                x="118"
                y="282"
                width="20"
                height="80"
                fill="#475569"
                stroke="#94a3b8"
                strokeWidth="1"
                rx="1"
              />
              {/* DisplayPort and HDMI ports on bracket */}
              <rect x="124" y="295" width="8" height="4" fill="#0f172a" />
              <rect x="124" y="310" width="8" height="4" fill="#0f172a" />
              <rect x="124" y="325" width="8" height="4" fill="#0f172a" />
              <rect x="124" y="340" width="8" height="4" fill="#0f172a" />

              {/* GPU Full Card Shroud & Backplate (281mm scaled width: 440px) */}
              <rect
                x="138"
                y="282"
                width="480"
                height="80"
                fill="url(#gpuBackplateGrad)"
                stroke="#475569"
                strokeWidth="1.5"
                rx="4"
              />

              {/* GPU Backplate Geometric Thermal Cutout / Flow-Through */}
              <rect
                x="500"
                y="292"
                width="95"
                height="60"
                fill="#11141a"
                stroke="#374151"
                strokeWidth="1"
                rx="2"
              />
              {Array.from({ length: 6 }).map((_, f) => (
                <line key={f} x1={510 + f * 14} y1="298" x2={510 + f * 14} y2="346" stroke="#2a3240" strokeWidth="2" />
              ))}
              <text x="515" y="325" fill="#64748b" fontFamily="monospace" fontSize="6.5" fontWeight="bold">
                FLOW-THROUGH
              </text>

              {/* GPU Cooling Array (Triple Axial Fans Cutout) */}
              {[
                { cx: 215, label: 'VENTILADOR 1' },
                { cx: 330, label: 'VENTILADOR 2' },
                { cx: 445, label: 'VENTILADOR 3' },
              ].map((gpuFan, i) => (
                <g key={i}>
                  <circle cx={gpuFan.cx} cy="322" r="32" fill="#14171f" stroke="#333c4a" strokeWidth="1.5" />
                  <circle cx={gpuFan.cx} cy="322" r="9" fill="#242b36" stroke="#475569" strokeWidth="1" />
                  {/* Blade lines */}
                  {Array.from({ length: 7 }).map((_, b) => {
                    const angle = (b * 360) / 7;
                    const rad = (angle * Math.PI) / 180;
                    const x2 = gpuFan.cx + 26 * Math.cos(rad);
                    const y2 = 322 + 26 * Math.sin(rad);
                    return (
                      <line
                        key={b}
                        x1={gpuFan.cx}
                        y1="322"
                        x2={x2}
                        y2={y2}
                        stroke="#252d3a"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  {/* Fan center badge with status color highlight */}
                  <circle cx={gpuFan.cx} cy="322" r="4" fill={getStatusColor('gpu')} />
                </g>
              ))}

              {/* GPU Card Brand & Model Silkscreen */}
              <text x="155" y="302" fill="#f8fafc" fontFamily="Space Grotesk, sans-serif" fontSize="11" fontWeight="bold">
                {gpuSlot?.component.name || 'GEFORCE RTX 4060 Ti'}
              </text>
              <text x="155" y="315" fill="#94a3b8" fontFamily="monospace" fontSize="7.5">
                PCIe 4.0 x16 INTERFACE • {gpuSlot?.component.tdpWattage || 160}W TDP
              </text>

              {/* Power Delivery Connector (12VHPWR / 8-Pin PCIe Cable plugged on top edge) */}
              <rect
                x="410"
                y="274"
                width="28"
                height="9"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="1"
                rx="1"
              />
              <path
                d="M 424 274 C 424 260, 480 260, 520 440 L 520 480"
                stroke="#1e2430"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 424 274 C 424 260, 480 260, 520 440 L 520 480"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="3,2"
                fill="none"
              />

              {/* Floating Status Badge Tag for GPU */}
              <g transform="translate(145, 375)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="22"
                  fill="#000000"
                  stroke={getStatusColor('gpu')}
                  strokeWidth="1.5"
                  rx="3"
                />
                <circle cx="10" cy="11" r="3.5" fill={getStatusColor('gpu')} />
                <text x="18" y="14" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="bold">
                  GPU: {gpuStatus.badgeText.split('/')[0].trim()}
                </text>
              </g>

              {/* Clearance Extension Ruler to Front Panel */}
              <g>
                <line
                  x1="618"
                  y1="322"
                  x2="780"
                  y2="322"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />
                <circle cx="618" cy="322" r="3" fill="#10b981" />
                <circle cx="780" cy="322" r="3" fill="#10b981" />
                <rect x="640" y="311" width="115" height="18" fill="#000000" stroke="#10b981" strokeWidth="1" rx="2" />
                <text x="647" y="323" fill="#10b981" fontFamily="monospace" fontSize="8" fontWeight="bold">
                  CLEARANCE: +84MM OK
                </text>
              </g>
            </g>

            {/* ============================================================== */}
            {/* 7. AIRFLOW GHOST VECTORS (OPTIONAL TOGGLE) */}
            {/* ============================================================== */}
            {showAirflowVectors && (
              <g id="airflow-vectors" opacity="0.8">
                {/* Cold Air Intake Vectors (Front -> CPU & GPU) */}
                <path
                  d="M 800 120 C 720 120, 620 145, 450 145"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  fill="none"
                  markerEnd="url(#cadAirflowBlue)"
                />
                <path
                  d="M 800 250 C 720 250, 640 310, 480 320"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  fill="none"
                  markerEnd="url(#cadAirflowBlue)"
                />
                <path
                  d="M 800 370 C 740 370, 600 350, 380 350"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  fill="none"
                  markerEnd="url(#cadAirflowBlue)"
                />

                {/* Warm Exhaust Vectors (CPU/GPU -> Rear & Top) */}
                <path
                  d="M 320 150 C 220 150, 160 160, 110 165"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  fill="none"
                  markerEnd="url(#cadAirflowWarm)"
                />
                <path
                  d="M 380 120 C 380 90, 420 70, 440 60"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  fill="none"
                  markerEnd="url(#cadAirflowWarm)"
                />
                <path
                  d="M 230 280 C 180 250, 150 200, 110 175"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  fill="none"
                  markerEnd="url(#cadAirflowWarm)"
                />
              </g>
            )}

            {/* ============================================================== */}
            {/* 8. DIMENSION RULER TICKS (MM SCALE) */}
            {/* ============================================================== */}
            {showDimensions && (
              <g id="dimension-rulers" opacity="0.75">
                {/* Horizontal Scale (Bottom: 0mm to 460mm Chassis Depth) */}
                <line x1="60" y1="595" x2="880" y2="595" stroke="#475569" strokeWidth="1" />
                <line x1="60" y1="588" x2="60" y2="602" stroke="#475569" strokeWidth="1.5" />
                <line x1="880" y1="588" x2="880" y2="602" stroke="#475569" strokeWidth="1.5" />
                <text x="65" y="608" fill="#94a3b8" fontFamily="monospace" fontSize="8">
                  0 mm [POSTERIOR]
                </text>
                <text x="440" y="608" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">
                  LONGITUD DEL CHASIS: 460 mm
                </text>
                <text x="820" y="608" fill="#94a3b8" fontFamily="monospace" fontSize="8">
                  460 mm [FRONTAL]
                </text>

                {/* Vertical Scale (Left: 0mm to 480mm Chassis Height) */}
                <line x1="45" y1="30" x2="45" y2="580" stroke="#475569" strokeWidth="1" />
                <line x1="38" y1="30" x2="52" y2="30" stroke="#475569" strokeWidth="1.5" />
                <line x1="38" y1="580" x2="52" y2="580" stroke="#475569" strokeWidth="1.5" />
                <text x="35" y="35" fill="#94a3b8" fontFamily="monospace" fontSize="8" textAnchor="end">
                  480 mm
                </text>
                <text
                  x="30"
                  y="310"
                  fill="#cbd5e1"
                  fontFamily="monospace"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform="rotate(-90 30 310)"
                >
                  ALTURA CHASIS: 480 mm
                </text>
                <text x="35" y="580" fill="#94a3b8" fontFamily="monospace" fontSize="8" textAnchor="end">
                  0 mm
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* 3. PANEL DE INSPECCIÓN DETALLADA & TELEMETRÍA POR COMPONENTE */}
      <div className="p-5 bg-white border-t border-black">
        {focusedComponentData ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ebe8e1] gap-2">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: focusedComponentData.statusObj.colorHex }}
                ></span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">
                      {focusedComponentData.code}
                    </span>
                    <span
                      className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 border"
                      style={{
                        borderColor: focusedComponentData.statusObj.colorHex,
                        color: focusedComponentData.statusObj.colorHex,
                        backgroundColor: `${focusedComponentData.statusObj.colorHex}15`,
                      }}
                    >
                      {focusedComponentData.statusObj.badgeText}
                    </span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-[18px] uppercase font-bold text-black mt-1">
                    {focusedComponentData.title}
                  </h3>
                </div>
              </div>

              {focusedComponentData.slot && onOpenSlotPicker && (
                <button
                  onClick={() => onOpenSlotPicker(focusedComponentData.slot!)}
                  className="px-4 py-2 bg-black text-white hover:bg-[#0050cc] font-mono text-[11px] uppercase font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">change_circle</span>
                  Cambiar en Configurador
                </button>
              )}
            </div>

            {/* Matriz de Telemetría del Componente */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#f6f3ec] p-3 border border-[#d8d5cd]">
                <span className="font-mono text-[10px] uppercase text-[#60656c] block font-bold">
                  UBICACIÓN EN CHASIS
                </span>
                <span className="font-mono text-[12px] font-bold text-black block mt-0.5">
                  {focusedComponentData.locationCoordinate}
                </span>
                <span className="font-sans text-[11px] text-[#444748] block mt-1">
                  Dimensiones: {focusedComponentData.dimensions}
                </span>
              </div>

              <div className="bg-[#f6f3ec] p-3 border border-[#d8d5cd]">
                <span className="font-mono text-[10px] uppercase text-[#60656c] block font-bold">
                  {focusedComponentData.statusObj.metricLabel}
                </span>
                <span
                  className="font-mono text-[14px] font-bold block mt-0.5"
                  style={{ color: focusedComponentData.statusObj.colorHex }}
                >
                  {focusedComponentData.statusObj.metricValue}
                </span>
                <span className="font-sans text-[11px] text-[#444748] block mt-1">
                  {focusedComponentData.statusObj.interfaceBus}
                </span>
              </div>

              <div className="bg-[#f6f3ec] p-3 border border-[#d8d5cd]">
                <span className="font-mono text-[10px] uppercase text-[#60656c] block font-bold">
                  EVALUACIÓN DE ESPACIO & CLEARANCE
                </span>
                <span className="font-mono text-[11px] text-black font-semibold block mt-0.5">
                  {focusedComponentData.statusObj.clearanceNote}
                </span>
              </div>

              <div className="bg-[#f6f3ec] p-3 border border-[#d8d5cd] flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#60656c] block font-bold">
                    ESTADO DE INTEGRACIÓN
                  </span>
                  <p className="font-sans text-[11px] text-[#22252a] mt-0.5">
                    {focusedComponentData.statusObj.detailText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vista General Resumen de los 3 Componentes */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebe8e1]">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#444748] font-bold">
                MATRIZ DE COMPONENTES CENTRALES RESALTADOS (CPU • GPU • RAM)
              </span>
              <span className="font-mono text-[10px] text-[#0050cc] font-bold">
                SELECCIONA CUALQUIER COMPONENTE PARA INSPECCIÓN DIRECTA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPU Summary Card */}
              <div
                onClick={() => setSelectedComponent('cpu')}
                className="p-4 border border-black hover:border-[#0050cc] cursor-pointer bg-[#fcf9f2] transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cpuStatus.colorHex }}
                    ></span>
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      PROCESADOR (CPU)
                    </span>
                  </div>
                  <span
                    className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                    style={{
                      borderColor: cpuStatus.colorHex,
                      color: cpuStatus.colorHex,
                    }}
                  >
                    {cpuStatus.badgeText.split('/')[0].trim()}
                  </span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-[15px] font-bold text-black uppercase mt-2 group-hover:text-[#0050cc]">
                  {cpuSlot?.component.name}
                </h4>
                <div className="mt-2 pt-2 border-t border-[#ebe8e1] space-y-1 font-mono text-[11px] text-[#555]">
                  <div>Zócalo: <strong className="text-black">Socket AM5</strong></div>
                  <div>Consumo: <strong className="text-black">{cpuSlot?.component.tdpWattage || 105}W TDP</strong></div>
                  <div>Posición: <span className="text-[#0050cc]">X: 370mm | Y: 135mm</span></div>
                </div>
              </div>

              {/* GPU Summary Card */}
              <div
                onClick={() => setSelectedComponent('gpu')}
                className="p-4 border border-black hover:border-[#0050cc] cursor-pointer bg-[#fcf9f2] transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: gpuStatus.colorHex }}
                    ></span>
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      TARJETA DE VIDEO (GPU)
                    </span>
                  </div>
                  <span
                    className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                    style={{
                      borderColor: gpuStatus.colorHex,
                      color: gpuStatus.colorHex,
                    }}
                  >
                    {gpuStatus.badgeText.split('/')[0].trim()}
                  </span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-[15px] font-bold text-black uppercase mt-2 group-hover:text-[#0050cc]">
                  {gpuSlot?.component.name}
                </h4>
                <div className="mt-2 pt-2 border-t border-[#ebe8e1] space-y-1 font-mono text-[11px] text-[#555]">
                  <div>Interfaz: <strong className="text-black">PCIe 4.0 x16</strong></div>
                  <div>Longitud: <strong className="text-black">281mm (+84mm OK)</strong></div>
                  <div>Posición: <span className="text-[#0050cc]">X: 235mm | Y: 280mm</span></div>
                </div>
              </div>

              {/* RAM Summary Card */}
              <div
                onClick={() => setSelectedComponent('ram')}
                className="p-4 border border-black hover:border-[#0050cc] cursor-pointer bg-[#fcf9f2] transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ramStatus.colorHex }}
                    ></span>
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      MEMORIA (RAM)
                    </span>
                  </div>
                  <span
                    className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                    style={{
                      borderColor: ramStatus.colorHex,
                      color: ramStatus.colorHex,
                    }}
                  >
                    {ramStatus.badgeText.split('/')[0].trim()}
                  </span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-[15px] font-bold text-black uppercase mt-2 group-hover:text-[#0050cc]">
                  {ramSlot?.component.name}
                </h4>
                <div className="mt-2 pt-2 border-t border-[#ebe8e1] space-y-1 font-mono text-[11px] text-[#555]">
                  <div>Canales: <strong className="text-black">Dual-Channel (A2/B2)</strong></div>
                  <div>Frecuencia: <strong className="text-black">6000 MT/s EXPO</strong></div>
                  <div>Posición: <span className="text-[#0050cc]">X: 470mm | Y: 110mm</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER TÉCNICO DE CERTIFICACIÓN DE CHASIS */}
      <div className="bg-[#ebe8e1] p-3 border-t border-black flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#444748] gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-black">architecture</span>
          <span>ESTÁNDAR DE MONTAJE: ATX 2.5 / CLEARANCE DE CÁMARA TERMICAMENTE VALIDADO</span>
        </div>
        <div className="flex items-center gap-3">
          <span>TOLERANCIA DIMENSIONAL: ±0.5mm</span>
          <span className="text-black font-bold">LABORATORIO NOVA CORE</span>
        </div>
      </div>
    </div>
  );
};
