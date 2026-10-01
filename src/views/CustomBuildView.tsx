import React, { useState, useMemo } from 'react';
import { ConfiguratorSlot, HardwareComponent } from '../types';
import { BuildAnalyticsPanel } from '../components/BuildAnalyticsPanel';
import { AirflowThermalHeatmap } from '../components/AirflowThermalHeatmap';
import {
  ChassisSchematicView,
  AMBIENT_COLOR_PRESETS,
  LightingEffect,
} from '../components/ChassisSchematicView';
import { validateCpuMoboCompatibility } from '../utils/compatibilityValidator';

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
  const [includeExtraFans, setIncludeExtraFans] = useState(false);

  // Chassis Ambient Lighting Customization States
  const [chassisAmbientColor, setChassisAmbientColor] = useState<string>('#0050cc');
  const [chassisLightingEffect, setChassisLightingEffect] = useState<LightingEffect>('static');
  const [chassisLightingBrightness, setChassisLightingBrightness] = useState<number>(100);

  const activeColorName = useMemo(() => {
    if (chassisLightingEffect === 'off') return 'Stealth (LEDs Desactivados)';
    if (chassisLightingEffect === 'rainbow') return 'Espectro Arcoíris Dinámico';
    const found = AMBIENT_COLOR_PRESETS.find(
      (p) => p.hex.toLowerCase() === chassisAmbientColor.toLowerCase()
    );
    return found ? found.name : `Personalizado (${chassisAmbientColor.toUpperCase()})`;
  }, [chassisAmbientColor, chassisLightingEffect]);

  const effectLabel = useMemo(() => {
    switch (chassisLightingEffect) {
      case 'static':
        return 'Estático Continuo';
      case 'pulse':
        return 'Pulso Rítmico (2.4s)';
      case 'breathing':
        return 'Respiración Suave (4.2s)';
      case 'rainbow':
        return 'Onda Arcoíris 360°';
      case 'off':
        return 'Desactivado (Stealth)';
    }
  }, [chassisLightingEffect]);

  // Dynamic calculations
  const hardwareSubtotal = slots.reduce((acc, slot) => acc + slot.component.price, 0);

  const assemblyCost = includeAssembly ? 600 : 0;
  const osCost = includeOS ? 350 : 0;
  const stressCost = includeStressTest ? 250 : 0;
  const extraFansCost = includeExtraFans ? 480 : 0;
  const servicesSubtotal = assemblyCost + osCost + stressCost + extraFansCost;

  const totalNeto = hardwareSubtotal + servicesSubtotal;
  const ivaAmount = Math.round(totalNeto * 0.16);

  // Calculate approximate TDP from CPU and GPU
  const cpuSlot = slots.find((s) => s.category === 'cpu');
  const moboSlot = slots.find((s) => s.category === 'mobo');
  const gpuSlot = slots.find((s) => s.category === 'gpu');
  const psuSlot = slots.find((s) => s.category === 'psu');

  // Hardware Compatibility Validation (Socket & Chipset)
  const compatibility = useMemo(
    () => validateCpuMoboCompatibility(cpuSlot?.component, moboSlot?.component),
    [cpuSlot, moboSlot]
  );

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
            {compatibility.isCompatible ? (
              <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-[#0050cc] animate-pulse"></span>
                MATRIZ DE COMPATIBILIDAD DINÁMICA ACTIVA
              </span>
            ) : (
              <span className="font-mono text-[10px] bg-red-600 text-white px-2 py-0.5 uppercase font-extrabold flex items-center gap-1.5 animate-pulse">
                <span className="material-symbols-outlined text-[13px]">report</span>
                ALERTA DE HARDWARE: {compatibility.title}
              </span>
            )}
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
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('chassis-schematic-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-mono text-[10px] uppercase font-bold px-2 py-1 bg-black text-white hover:bg-[#0050cc] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">architecture</span>
                  Esquema Chasis (SVG)
                </button>
                <span className="font-mono text-[11px] uppercase text-[#444748] font-bold">
                  {slots.length}/{slots.length} SLOTS SELECCIONADOS
                </span>
              </div>
            </div>

            {/* Lista Monolítica Modular de Slots */}
            <div className="flex flex-col border border-black bg-white divide-y divide-black">
              {slots.map((slot) => {
                const isCpuOrMobo = slot.category === 'cpu' || slot.category === 'mobo';
                const isSlotIncompatible = !compatibility.isCompatible && isCpuOrMobo;

                return (
                  <div
                    key={slot.slotNumber}
                    className={`p-4 transition-all ${
                      isSlotIncompatible
                        ? 'bg-red-50/90 border-l-4 border-l-red-600 shadow-[inset_0_0_12px_rgba(239,68,68,0.12)]'
                        : 'hover:bg-[#f6f3ec]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 border flex items-center justify-center shrink-0 ${
                            isSlotIncompatible
                              ? 'bg-red-600 text-white border-red-700 animate-pulse'
                              : 'bg-[#f1eee7] border-black text-black'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {isSlotIncompatible ? 'warning' : slot.icon}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`font-mono text-[10px] px-1.5 py-0.5 uppercase font-bold ${
                                isSlotIncompatible ? 'bg-red-600 text-white' : 'bg-black text-white'
                              }`}
                            >
                              SLOT {slot.slotNumber}
                            </span>
                            <span className="font-mono text-[10px] text-[#444748] uppercase font-bold tracking-wider">
                              {slot.label}
                            </span>
                            {isSlotIncompatible && (
                              <span className="font-mono text-[9px] bg-red-100 text-red-800 border border-red-600 px-1.5 py-0.5 uppercase font-extrabold flex items-center gap-1 animate-pulse">
                                <span className="material-symbols-outlined text-[12px] text-red-600">error</span>
                                {compatibility.hasSocketConflict
                                  ? `INCOMPATIBLE: SOCKET ${compatibility.cpuSocket} ≠ ${compatibility.moboSocket}`
                                  : `INCOMPATIBLE: CHIPSET ${compatibility.moboChipset}`}
                              </span>
                            )}
                          </div>
                          <h2
                            className={`font-['Space_Grotesk'] text-[18px] uppercase font-bold ${
                              isSlotIncompatible ? 'text-red-900' : 'text-black'
                            }`}
                          >
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
                          className={`font-mono text-[11px] uppercase tracking-wider font-bold mt-1 cursor-pointer underline ${
                            isSlotIncompatible
                              ? 'text-red-600 hover:text-black font-extrabold'
                              : 'text-black hover:text-[#0050cc]'
                          }`}
                          type="button"
                        >
                          {isSlotIncompatible ? 'Corregir Incompatibilidad' : 'Cambiar Slot'}
                        </button>
                      </div>
                    </div>

                    {/* Advertencia Técnica Específica Dentro del Slot Afectado */}
                    {isSlotIncompatible && (
                      <div className="mt-3 p-3 bg-red-100/90 border border-red-500 text-red-950 font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0 mt-0.5">
                            gpp_bad
                          </span>
                          <div>
                            <span className="font-bold block uppercase text-red-800 tracking-wide text-[11px]">
                              {slot.category === 'cpu'
                                ? `[INCOMPATIBILIDAD EN CPU] Requiere Zócalo Socket ${compatibility.cpuSocket}`
                                : `[INCOMPATIBILIDAD EN PLACA BASE] Posee Zócalo Socket ${compatibility.moboSocket} / Chipset ${compatibility.moboChipset}`}
                            </span>
                            <p className="text-[11px] text-red-950 font-sans mt-0.5 leading-snug">
                              {compatibility.technicalDetails}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onOpenSlotPicker(slot)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-black text-white font-mono text-[10px] uppercase font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-center"
                          type="button"
                        >
                          Cambiar por {slot.category === 'cpu' ? `CPU ${compatibility.moboSocket}` : `Placa ${compatibility.cpuSocket}`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ETAPA DE PERSONALIZACIÓN: ILUMINACIÓN AMBIENTAL ARGB DEL CHASIS */}
            <div
              id="chassis-lighting-section"
              className="border border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000000] space-y-5"
            >
              <div className="border-b border-black pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase bg-black text-white px-2 py-0.5 font-bold tracking-wider">
                      CONTROLADOR ARGB
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#0050cc] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#0050cc] animate-pulse"></span>
                      SINCRONIZACIÓN 5V 3-PIN EN VIVO
                    </span>
                  </div>
                  <h2 className="font-['Space_Grotesk'] text-[22px] sm:text-[24px] uppercase text-black font-bold tracking-tight">
                    Iluminación Ambiental del Chasis
                  </h2>
                  <p className="font-sans text-[12px] text-[#444748] max-w-2xl mt-0.5">
                    Personaliza la paleta cromática de los diodos LED ARGB integrados en la estructura del chasis (tira perimetral superior, ventiladores de admisión/extracción, deflector PSU y halo de la placa). El esquema vectorial inferior se actualiza en tiempo real con el color seleccionado.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('chassis-schematic-panel');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-mono text-[10px] uppercase font-bold px-3 py-1.5 bg-[#f6f3ec] hover:bg-black hover:text-white border border-black transition-colors flex items-center gap-1.5 cursor-pointer text-black"
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#0050cc]">architecture</span>
                    Ver en Esquema SVG ↓
                  </button>
                </div>
              </div>

              {/* Banner de Previsualización Activa & Telemetría */}
              <div className="bg-[#121519] border border-black p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-sm border-2 border-white/80 shrink-0 transition-all duration-300 shadow-[0_0_16px_rgba(255,255,255,0.2)] flex items-center justify-center"
                    style={{
                      backgroundColor: chassisLightingEffect === 'off' ? '#1a1f26' : chassisAmbientColor,
                      boxShadow: chassisLightingEffect === 'off' ? 'none' : `0 0 20px ${chassisAmbientColor}88`,
                    }}
                  >
                    <span className="material-symbols-outlined text-white text-[24px] drop-shadow-sm">
                      {chassisLightingEffect === 'off' ? 'lightbulb_circle' : 'palette'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-[#889098] uppercase tracking-wider block font-bold">
                      TONO ACTIVO SELECCIONADO
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-['Space_Grotesk'] text-[18px] font-bold text-white uppercase">
                        {activeColorName}
                      </span>
                      <span className="font-mono text-[11px] bg-black/60 border border-white/20 px-2 py-0.5 text-[#38bdf8] font-bold">
                        {chassisAmbientColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                  <span className="bg-[#1b212b] border border-[#303848] px-2.5 py-1 text-white">
                    MODO: <strong className="text-[#38bdf8] font-bold uppercase">{effectLabel}</strong>
                  </span>
                  <span className="bg-[#1b212b] border border-[#303848] px-2.5 py-1 text-white">
                    INTENSIDAD: <strong className="text-white font-bold">{chassisLightingEffect === 'off' ? '0%' : `${chassisLightingBrightness}%`}</strong>
                  </span>
                  <span className="bg-[#0f291e] border border-[#10b981]/50 px-2.5 py-1 text-[#10b981] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                    SYNC PLACA ATX OK
                  </span>
                </div>
              </div>

              {/* Selector de Paleta Predefinida */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#444748] font-bold">
                    1. PALETAS TÉCNICAS DISPONIBLES ({AMBIENT_COLOR_PRESETS.length}):
                  </span>
                  <span className="font-mono text-[10px] text-[#60656c]">
                    Haz clic para aplicar instantáneamente
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {AMBIENT_COLOR_PRESETS.map((preset) => {
                    const isSelected =
                      chassisLightingEffect !== 'off' &&
                      chassisAmbientColor.toLowerCase() === preset.hex.toLowerCase();
                    const isStealth = preset.id === 'stealth';

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (isStealth) {
                            setChassisLightingEffect('off');
                          } else {
                            setChassisAmbientColor(preset.hex);
                            if (chassisLightingEffect === 'off') setChassisLightingEffect('static');
                          }
                        }}
                        className={`p-2.5 border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected || (isStealth && chassisLightingEffect === 'off')
                            ? 'border-black bg-[#121519] text-white shadow-md ring-2 ring-black'
                            : 'border-[#c4c7c7] bg-[#fcf9f2] hover:border-black text-black hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border border-black/30 shadow-xs"
                          style={{ backgroundColor: preset.hex }}
                        ></span>
                        <div className="overflow-hidden">
                          <span className="font-mono text-[11px] font-bold uppercase block truncate leading-tight">
                            {preset.name}
                          </span>
                          <span
                            className={`font-mono text-[9px] block ${
                              isSelected || (isStealth && chassisLightingEffect === 'off')
                                ? 'text-[#94a3b8]'
                                : 'text-[#64748b]'
                            }`}
                          >
                            {preset.hex.toUpperCase()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Color HEX Personalizado & Selector HTML5 */}
              <div className="p-4 border border-[#d8d5cd] bg-[#f6f3ec] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-black font-bold block">
                    2. COLOR HEXADECIMAL PERSONALIZADO:
                  </span>
                  <p className="font-sans text-[11px] text-[#444748]">
                    Selecciona cualquier tonalidad del espectro RGB o ingresa un código hexadecimal específico.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Botón e input color HTML5 */}
                  <div className="flex items-center gap-2 bg-white border border-black p-1.5">
                    <label className="relative w-8 h-8 rounded-sm cursor-pointer overflow-hidden border border-black flex items-center justify-center shrink-0">
                      <input
                        type="color"
                        value={
                          chassisAmbientColor.startsWith('#') && chassisAmbientColor.length === 7
                            ? chassisAmbientColor
                            : '#0050cc'
                        }
                        onChange={(e) => {
                          setChassisAmbientColor(e.target.value);
                          if (chassisLightingEffect === 'off') setChassisLightingEffect('static');
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: chassisAmbientColor }}
                      />
                    </label>
                    <span className="font-mono text-[11px] font-bold text-black uppercase pr-1">
                      Elegir en Rueda RGB
                    </span>
                  </div>

                  {/* Input de texto HEX */}
                  <div className="flex items-center gap-1.5 bg-white border border-black px-2.5 py-1.5">
                    <span className="font-mono text-[11px] font-bold text-[#444748]">HEX:</span>
                    <input
                      type="text"
                      maxLength={7}
                      value={chassisAmbientColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        setChassisAmbientColor(val);
                        if (/^#[0-9A-F]{6}$/i.test(val) && chassisLightingEffect === 'off') {
                          setChassisLightingEffect('static');
                        }
                      }}
                      className="font-mono text-[12px] font-bold text-black uppercase w-24 bg-transparent focus:outline-none"
                      placeholder="#0050CC"
                    />
                  </div>
                </div>
              </div>

              {/* Efectos Dinámicos & Control de Brillo */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
                <div className="md:col-span-8 space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#444748] font-bold block">
                    3. PATRÓN DE ANIMACIÓN / EFECTO ARGB:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'static', label: 'Estático', icon: 'flare', desc: 'Fijo homogéneo' },
                      { id: 'pulse', label: 'Pulso', icon: 'motion_photos_on', desc: 'Oscilación 2.4s' },
                      { id: 'breathing', label: 'Respiración', icon: 'air', desc: 'Suave 4.2s' },
                      { id: 'rainbow', label: 'Arcoíris', icon: 'cyclone', desc: 'Espectro 360°' },
                      { id: 'off', label: 'Apagado', icon: 'power_settings_new', desc: 'Modo Stealth' },
                    ].map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        onClick={() => setChassisLightingEffect(ef.id as LightingEffect)}
                        className={`p-2 border text-left transition-all cursor-pointer ${
                          chassisLightingEffect === ef.id
                            ? 'bg-black text-white border-black shadow-xs font-bold'
                            : 'bg-[#fcf9f2] text-black border-[#c4c7c7] hover:border-black'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px]">
                            {ef.icon}
                          </span>
                          <span className="font-mono text-[11px] uppercase block leading-tight">
                            {ef.label}
                          </span>
                        </div>
                        <span
                          className={`font-sans text-[10px] block mt-0.5 ${
                            chassisLightingEffect === ef.id ? 'text-[#a0a8b0]' : 'text-[#64748b]'
                          }`}
                        >
                          {ef.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#444748] font-bold">
                      4. INTENSIDAD / BRILLO:
                    </span>
                    <span className="font-mono text-[12px] font-bold text-black">
                      {chassisLightingEffect === 'off' ? '0%' : `${chassisLightingBrightness}%`}
                    </span>
                  </div>
                  <div className="p-3 bg-[#fcf9f2] border border-[#c4c7c7] space-y-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      disabled={chassisLightingEffect === 'off'}
                      value={chassisLightingBrightness}
                      onChange={(e) => setChassisLightingBrightness(Number(e.target.value))}
                      className="w-full h-2 accent-black cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-[#64748b]">
                      <span>10% Sutil</span>
                      <span>50% Nocturno</span>
                      <span>100% Máximo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ETAPA ARQUITECTÓNICA: ESQUEMA DEL CHASIS (SVG) & POSICIONAMIENTO DE COMPONENTES */}
            <div id="chassis-schematic-panel">
              <ChassisSchematicView
                slots={slots}
                onOpenSlotPicker={onOpenSlotPicker}
                ambientColor={chassisAmbientColor}
                onAmbientColorChange={setChassisAmbientColor}
                lightingEffect={chassisLightingEffect}
                onLightingEffectChange={setChassisLightingEffect}
                lightingBrightness={chassisLightingBrightness}
                onLightingBrightnessChange={setChassisLightingBrightness}
              />
            </div>

            {/* ETAPA INTERMEDIA: PANEL DE VISUALIZACIÓN DE DATOS RECHARTS */}
            <div id="analytics-panel">
              <BuildAnalyticsPanel
                slots={slots}
                servicesSubtotal={servicesSubtotal}
                totalNeto={totalNeto}
              />
            </div>

            {/* ETAPA TÉRMICA: SIMULACIÓN DE FLUJO DE AIRE Y MAPA DE CALOR */}
            <div id="thermal-panel">
              <AirflowThermalHeatmap
                slots={slots}
                hasExtraFansInstalled={includeExtraFans}
                onAddExtraFan={() => {
                  setIncludeExtraFans(true);
                  const el = document.getElementById('services-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* ETAPA 02: Servicios Adicionales de Laboratorio */}
            <div id="services-section" className="border border-black bg-white p-6 space-y-4">
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

                {/* Opción 4: Kit de Ventilación Suplementaria PWM */}
                <label className="flex items-start justify-between p-4 border border-[#c4c7c7] hover:border-black cursor-pointer transition-all bg-[#fcf9f2] select-none">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={includeExtraFans}
                      onChange={(e) => setIncludeExtraFans(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-black cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[12px] font-bold uppercase text-black block">
                          Kit de Ventilación Forzada & Flujo Positivo (+2 Fans PWM 140mm)
                        </span>
                        <span className="font-mono text-[9px] bg-[#0050cc] text-white px-1.5 py-0.2 font-bold uppercase">
                          RECOMENDADO
                        </span>
                      </div>
                      <p className="font-sans text-[12px] text-[#444748] leading-relaxed mt-0.5">
                        Instalación y calibración PWM de 2 ventiladores de alta presión estática (140mm) en el panel frontal
                        para optimizar la admisión y reducir hasta -7°C en la GPU y -5°C en el slot M.2 NVMe.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-black whitespace-nowrap pl-3">
                    +$480 MXN
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

              {/* Badge de Compatibilidad / Advertencia Técnica */}
              {compatibility.isCompatible ? (
                <div className="border border-black bg-black text-white p-3 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#b3c5ff] text-[24px]">
                    verified
                  </span>
                  <div>
                    <span className="font-mono text-[12px] uppercase font-bold block leading-tight">
                      100% COMPATIBILIDAD VERIFICADA
                    </span>
                    <span className="font-mono text-[10px] text-[#ebe8e1] block leading-none mt-0.5">
                      Socket {compatibility.cpuSocket} · Chipset {compatibility.moboChipset} · ATX OK
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-red-600 bg-red-600 text-white p-4 shadow-[4px_4px_0px_0px_#991b1b] space-y-3 animate-pulse">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-white text-[28px] shrink-0">
                      report_problem
                    </span>
                    <div>
                      <span className="font-mono text-[12px] uppercase font-extrabold block leading-tight tracking-wider">
                        ADVERTENCIA TÉCNICA // INCOMPATIBILIDAD
                      </span>
                      <span className="font-mono text-[10px] text-red-100 block leading-tight mt-0.5 font-bold">
                        {compatibility.title}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/30 p-2.5 border border-white/20 font-mono text-[10px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-red-200 uppercase">PROCESADOR (CPU):</span>
                      <span className="font-bold text-white truncate max-w-[150px]">{cpuSlot?.component.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-1">
                      <span className="text-red-200 uppercase">ZÓCALO REQUERIDO CPU:</span>
                      <span className="font-extrabold text-yellow-300">Socket {compatibility.cpuSocket}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-1">
                      <span className="text-red-200 uppercase">TARJETA MADRE (MOBO):</span>
                      <span className="font-bold text-white truncate max-w-[150px]">{moboSlot?.component.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-1">
                      <span className="text-red-200 uppercase">ZÓCALO ACTUAL PLACA:</span>
                      <span className="font-extrabold text-yellow-300">Socket {compatibility.moboSocket}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-1">
                      <span className="text-red-200 uppercase">CHIPSET DE LA PLACA:</span>
                      <span className="font-bold text-white">{compatibility.moboChipset}</span>
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-red-100 leading-snug">
                    {compatibility.description}
                  </p>

                  <div className="pt-1 flex flex-col gap-1.5">
                    {moboSlot && (
                      <button
                        onClick={() => onOpenSlotPicker(moboSlot)}
                        className="w-full py-1.5 px-2 bg-white text-red-700 hover:bg-black hover:text-white font-mono text-[10px] uppercase font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                        Cambiar Placa Base a Socket {compatibility.cpuSocket}
                      </button>
                    )}
                    {cpuSlot && (
                      <button
                        onClick={() => onOpenSlotPicker(cpuSlot)}
                        className="w-full py-1.5 px-2 bg-black/50 hover:bg-black text-white border border-white/40 font-mono text-[10px] uppercase font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                        Cambiar CPU a Socket {compatibility.moboSocket}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Matriz de Dimensiones y Espacios Físicos */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between border-b border-[#ebe8e1] pb-1">
                  <span className="text-[#444748] uppercase">ZÓCALO CPU / PLACA:</span>
                  <span className={`font-bold font-mono text-[10px] ${compatibility.isCompatible ? 'text-[#10b981]' : 'text-red-600 font-extrabold'}`}>
                    {compatibility.isCompatible
                      ? `Socket ${compatibility.cpuSocket} (100% OK)`
                      : `INCOMPATIBLE (${compatibility.cpuSocket} ≠ ${compatibility.moboSocket})`}
                  </span>
                </div>
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
                <div className="flex justify-between border-b border-[#ebe8e1] pb-1">
                  <span className="text-[#444748] uppercase">ILUMINACIÓN CHASIS:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('chassis-lighting-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-bold flex items-center gap-1.5 font-mono text-[10px] text-black hover:text-[#0050cc] cursor-pointer"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block border border-black/30 shadow-xs"
                      style={{
                        backgroundColor:
                          chassisLightingEffect === 'off' ? '#444' : chassisAmbientColor,
                      }}
                    ></span>
                    <span>
                      {chassisLightingEffect === 'off'
                        ? 'STEALTH (OFF)'
                        : chassisLightingEffect === 'rainbow'
                        ? 'ARCOÍRIS ARGB'
                        : chassisAmbientColor.toUpperCase()}
                    </span>
                  </button>
                </div>
              </div>

              {/* Botón Acceso Directo a Iluminación & Esquema SVG */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('chassis-lighting-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-2 bg-[#f6f3ec] hover:bg-black hover:text-white border border-black font-mono text-[10px] uppercase font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer text-black"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0050cc]">palette</span>
                  Luces ARGB
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('chassis-schematic-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-2 bg-[#f6f3ec] hover:bg-black hover:text-white border border-black font-mono text-[10px] uppercase font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer text-black"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0050cc]">architecture</span>
                  Esquema SVG
                </button>
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
                  <div className="flex items-center gap-2">
                    <a
                      href="#analytics-panel"
                      className="inline-flex items-center gap-0.5 font-mono text-[10px] text-[#0050cc] uppercase font-bold hover:underline"
                    >
                      <span>Telemetría</span>
                      <span className="material-symbols-outlined text-[13px]">query_stats</span>
                    </a>
                    <span className="text-[#c4c7c7]">•</span>
                    <a
                      href="#thermal-panel"
                      className="inline-flex items-center gap-0.5 font-mono text-[10px] text-[#0050cc] uppercase font-bold hover:underline"
                    >
                      <span>Mapa Térmico</span>
                      <span className="material-symbols-outlined text-[13px]">mode_fan</span>
                    </a>
                  </div>
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
                {!compatibility.isCompatible && (
                  <div className="p-2.5 bg-red-50 border border-red-600 text-red-900 font-mono text-[10px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 text-[16px] shrink-0">lock</span>
                    <span>MONTAJE BLOQUEADO: Resuelve la incompatibilidad de zócalo para habilitar el pedido de ensamble.</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!compatibility.isCompatible) {
                      const el = document.getElementById('chassis-schematic-panel');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                    onProceedOrder(totalNeto, slots.length);
                  }}
                  className={`w-full py-3 px-4 font-mono text-[12px] uppercase tracking-wider font-bold border transition-all flex items-center justify-center gap-2 shadow-md ${
                    compatibility.isCompatible
                      ? 'bg-black text-white border-black hover:bg-[#0050cc] hover:border-[#0050cc] cursor-pointer'
                      : 'bg-red-800 text-white border-red-900 cursor-not-allowed opacity-90'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {compatibility.isCompatible ? 'build_circle' : 'gpp_bad'}
                  </span>
                  <span>
                    {compatibility.isCompatible
                      ? 'Proceder al Pedido de Ensamble'
                      : 'Ensamble Bloqueado por Incompatibilidad'}
                  </span>
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
