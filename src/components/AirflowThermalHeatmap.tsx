import React, { useState, useMemo } from 'react';
import { ConfiguratorSlot } from '../types';

interface AirflowThermalHeatmapProps {
  slots: ConfiguratorSlot[];
  hasExtraFansInstalled?: boolean;
  onAddExtraFan?: () => void;
}

export const AirflowThermalHeatmap: React.FC<AirflowThermalHeatmapProps> = ({
  slots,
  hasExtraFansInstalled = false,
  onAddExtraFan,
}) => {
  const [loadLevel, setLoadLevel] = useState<'idle' | 'gaming' | 'stress'>('stress');
  const [fanProfile, setFanProfile] = useState<'quiet' | 'balanced' | 'performance'>('balanced');
  const [viewMode, setViewMode] = useState<'heatmap' | 'vectors' | 'sensors'>('heatmap');
  const [selectedZone, setSelectedZone] = useState<string | null>('cpu');

  // 1. EXTRACT HARDWARE CONFIGURATION
  const cpuSlot = slots.find((s) => s.category === 'cpu');
  const gpuSlot = slots.find((s) => s.category === 'gpu');
  const moboSlot = slots.find((s) => s.category === 'mobo');
  const ramSlot = slots.find((s) => s.category === 'ram');
  const ssdSlot = slots.find((s) => s.category === 'ssd');
  const coolerSlot = slots.find(
    (s) => s.category === 'thermal' && s.label.toLowerCase().includes('refrigeración')
  );
  const pasteSlot = slots.find(
    (s) => s.category === 'thermal' && s.label.toLowerCase().includes('pasta')
  );
  const caseSlot = slots.find((s) => s.category === 'chassis');
  const psuSlot = slots.find((s) => s.category === 'psu');

  // 2. THERMAL AND POWER METRICS
  const thermalAnalysis = useMemo(() => {
    // CPU TDP
    const cpuName = cpuSlot?.component.name.toLowerCase() || '';
    let cpuTdp = cpuSlot?.component.tdpWattage || 105;
    if (cpuName.includes('7800x3d')) cpuTdp = 120;
    else if (cpuName.includes('7600x')) cpuTdp = 105;

    // GPU TDP
    const gpuName = gpuSlot?.component.name.toLowerCase() || '';
    let gpuTdp = gpuSlot?.component.tdpWattage || 160;
    if (gpuName.includes('4070')) gpuTdp = 220;
    else if (gpuName.includes('4060')) gpuTdp = 160;

    // Cooler rating
    const coolerName = coolerSlot?.component.name.toLowerCase() || '';
    let coolerRatingWatts = 260; // DeepCool AK620 standard
    if (coolerName.includes('ak620')) coolerRatingWatts = 260;
    else if (coolerName.includes('liquid') || coolerName.includes('360')) coolerRatingWatts = 320;
    else if (coolerName.includes('stock')) coolerRatingWatts = 95;

    // Thermal Paste efficiency
    const pasteName = pasteSlot?.component.name.toLowerCase() || '';
    let pasteBonusC = 0;
    if (pasteName.includes('liquid metal')) pasteBonusC = -4.5;
    else if (pasteName.includes('mx-4')) pasteBonusC = -2.0;

    // Load multiplier
    const loadMult = loadLevel === 'idle' ? 0.2 : loadLevel === 'gaming' ? 0.75 : 1.0;

    // Fan cooling effect
    const fanCoolingBonus = (fanProfile === 'quiet' ? 4 : fanProfile === 'performance' ? -4 : 0) + (hasExtraFansInstalled ? -5.5 : 0);

    // BASELINE AMBIENT
    const ambientC = 23;

    // Dynamic component temperatures under current load
    const cpuTemp = Math.round(
      ambientC +
        ((cpuTdp * loadMult) / (coolerRatingWatts / 100)) * 0.95 +
        pasteBonusC +
        fanCoolingBonus
    );

    const gpuTemp = Math.round(
      ambientC + (gpuTdp * loadMult * 0.24) + fanCoolingBonus
    );

    const vrmTemp = Math.round(
      ambientC + (cpuTdp * loadMult * 0.32) + (moboSlot ? 4 : 0) + fanCoolingBonus * 0.8
    );

    const nvmeTemp = Math.round(
      ambientC + 16 + (ssdSlot ? 8 : 0) * loadMult + (gpuTemp > 70 ? 8 : 4) + fanCoolingBonus * 0.5
    );

    const ramTemp = Math.round(ambientC + 12 + 10 * loadMult + fanCoolingBonus * 0.5);
    const psuTemp = Math.round(ambientC + 14 + 12 * loadMult);
    const internalAmbient = Math.round(ambientC + (cpuTdp + gpuTdp) * loadMult * 0.05 + (hasExtraFansInstalled ? -3 : 0));

    // Total System Heat Output
    const totalWatts = Math.round(cpuTdp + gpuTdp + 65);

    // VENTILATION DEFICIT ALGORITHM:
    const baselineDeficit = totalWatts >= 340 || gpuTdp >= 210 || (cpuTemp + (hasExtraFansInstalled ? 5 : 0)) >= 78;
    const requiresAdditionalFans = !hasExtraFansInstalled && baselineDeficit;
    const recommendedFanCount = baselineDeficit ? (totalWatts > 400 ? 3 : 2) : 0;
    const airflowBalance = hasExtraFansInstalled
      ? 'Presión Positiva Alta (+2 Fans PWM Activos)'
      : requiresAdditionalFans
      ? 'Déficit de Flujo / Presión Negativa'
      : 'Presión Positiva Óptima';

    return {
      cpuTdp,
      gpuTdp,
      totalWatts,
      ambientC,
      internalAmbient,
      temperatures: {
        cpu: cpuTemp,
        gpu: gpuTemp,
        vrm: vrmTemp,
        nvme: nvmeTemp,
        ram: ramTemp,
        psu: psuTemp,
      },
      hasExtraFansInstalled,
      requiresAdditionalFans,
      recommendedFanCount,
      airflowBalance,
    };
  }, [cpuSlot, gpuSlot, moboSlot, ssdSlot, coolerSlot, pasteSlot, loadLevel, fanProfile, hasExtraFansInstalled]);

  // Color helper based on temperature
  const getTempColor = (temp: number) => {
    if (temp < 45) return { hex: '#0050cc', label: 'Óptimo / Frío', badge: 'bg-[#0050cc] text-white' };
    if (temp < 60) return { hex: '#0284c7', label: 'Nominal', badge: 'bg-sky-700 text-white' };
    if (temp < 72) return { hex: '#eab308', label: 'Cálido Normal', badge: 'bg-amber-500 text-black' };
    if (temp < 80) return { hex: '#f97316', label: 'Elevado / Alto Flujo', badge: 'bg-orange-600 text-white' };
    return { hex: '#dc2626', label: 'Crítico / Requiere Disipación', badge: 'bg-red-600 text-white' };
  };

  const cpuColor = getTempColor(thermalAnalysis.temperatures.cpu);
  const gpuColor = getTempColor(thermalAnalysis.temperatures.gpu);
  const vrmColor = getTempColor(thermalAnalysis.temperatures.vrm);
  const nvmeColor = getTempColor(thermalAnalysis.temperatures.nvme);
  const ramColor = getTempColor(thermalAnalysis.temperatures.ram);

  return (
    <div className="border border-black bg-white p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-black gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#0050cc]"></span>
            <span className="font-mono text-[10px] uppercase text-[#444748] tracking-widest font-bold">
              [TELEMETRÍA TÉRMICA // DINÁMICA DE FLUIDOS CHASSIS]
            </span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-[20px] sm:text-[22px] uppercase font-bold text-black tracking-tight mt-0.5">
            Mapa de Calor & Flujo de Aire (Airflow)
          </h3>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {thermalAnalysis.requiresAdditionalFans ? (
            <div className="px-3 py-1.5 bg-amber-50 border border-amber-600 text-amber-900 font-mono text-[11px] font-bold uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-600">
                warning
              </span>
              <span>Ventilación Adicional Recomendada (+{thermalAnalysis.recommendedFanCount} Fans)</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-600 text-emerald-900 font-mono text-[11px] font-bold uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                verified
              </span>
              <span>Flujo Térmico Balanceado (100% Validado)</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Strip (Load / Fan Profile / View Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#f6f3ec] border border-[#c4c7c7] font-mono text-[11px]">
        {/* Load simulation selector */}
        <div className="space-y-1">
          <span className="text-[#444748] uppercase font-bold text-[10px] block">
            RÉGIMEN DE CARGA INDUSTRIAL:
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                { id: 'idle', label: 'Idle (15%)' },
                { id: 'gaming', label: 'Gaming (75%)' },
                { id: 'stress', label: 'Estrés (100%)' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setLoadLevel(m.id)}
                className={`py-1 px-1.5 text-center font-bold uppercase border cursor-pointer transition-colors ${
                  loadLevel === m.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-[#c4c7c7] hover:bg-[#ebe8e1]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fan speed profile */}
        <div className="space-y-1">
          <span className="text-[#444748] uppercase font-bold text-[10px] block">
            PERFIL DE VENTILADORES CHASIS:
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                { id: 'quiet', label: 'Silencioso' },
                { id: 'balanced', label: 'Balanceado' },
                { id: 'performance', label: 'Rendimiento' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setFanProfile(p.id)}
                className={`py-1 px-1.5 text-center font-bold uppercase border cursor-pointer transition-colors ${
                  fanProfile === p.id
                    ? 'bg-[#0050cc] text-white border-[#0050cc]'
                    : 'bg-white text-black border-[#c4c7c7] hover:bg-[#ebe8e1]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization Mode */}
        <div className="space-y-1">
          <span className="text-[#444748] uppercase font-bold text-[10px] block">
            CAPA DE TELEMETRÍA:
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                { id: 'heatmap', label: 'Mapa Térmico' },
                { id: 'vectors', label: 'Vectores Flujo' },
                { id: 'sensors', label: 'Matriz Sensores' },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`py-1 px-1.5 text-center font-bold uppercase border cursor-pointer transition-colors ${
                  viewMode === v.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-[#c4c7c7] hover:bg-[#ebe8e1]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive CAD Viewport */}
      <div className="relative border border-black bg-[#121316] overflow-hidden p-4 sm:p-6 text-white select-none">
        {/* Architectural Grid overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #444748 1px, transparent 1px), linear-gradient(to bottom, #444748 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Chassis Metadata Overlay */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-white/20 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="bg-[#0050cc] text-white px-1.5 py-0.5 font-bold uppercase">
              CHASIS ATX: {caseSlot?.component.name || 'NZXT H5 Flow'}
            </span>
            <span className="text-[#c4c7c7]">
              POTENCIA TÉRMICA TOTAL: <strong className="text-white">{thermalAnalysis.totalWatts}W TDP</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[#c4c7c7]">
            <span>TEMP AMBIENTE: {thermalAnalysis.ambientC}°C</span>
            <span>CHAMBER: {thermalAnalysis.internalAmbient}°C</span>
            <span className="font-bold text-white uppercase">{thermalAnalysis.airflowBalance}</span>
          </div>
        </div>

        {/* SVG CHASSIS SCHEMATIC & THERMAL HEATMAP */}
        <div className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[420px] flex items-center justify-center">
          <svg
            viewBox="0 0 900 420"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
          >
            <defs>
              {/* Thermal radial gradients */}
              <radialGradient id="cpuHeatGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={cpuColor.hex} stopOpacity="0.85" />
                <stop offset="60%" stopColor={cpuColor.hex} stopOpacity="0.45" />
                <stop offset="100%" stopColor={cpuColor.hex} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="gpuHeatGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={gpuColor.hex} stopOpacity="0.85" />
                <stop offset="55%" stopColor={gpuColor.hex} stopOpacity="0.4" />
                <stop offset="100%" stopColor={gpuColor.hex} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="vrmHeatGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={vrmColor.hex} stopOpacity="0.8" />
                <stop offset="65%" stopColor={vrmColor.hex} stopOpacity="0.3" />
                <stop offset="100%" stopColor={vrmColor.hex} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="nvmeHeatGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={nvmeColor.hex} stopOpacity="0.85" />
                <stop offset="60%" stopColor={nvmeColor.hex} stopOpacity="0.35" />
                <stop offset="100%" stopColor={nvmeColor.hex} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="intakeColdGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0050cc" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#0050cc" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0050cc" stopOpacity="0" />
              </radialGradient>

              {/* Arrow marker for airflow */}
              <marker
                id="airflowArrowBlue"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>

              <marker
                id="airflowArrowWarm"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
              </marker>
            </defs>

            {/* CHASSIS OUTER FRAME */}
            <rect
              x="60"
              y="20"
              width="780"
              height="380"
              fill="#1a1c20"
              stroke="#55585a"
              strokeWidth="2.5"
              rx="4"
            />

            {/* FRONT INTAKE MESH (LEFT) */}
            <rect
              x="60"
              y="20"
              width="36"
              height="380"
              fill="#24272c"
              stroke="#3e4246"
              strokeWidth="1.5"
            />
            {/* Front intake perforations pattern */}
            {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((y, i) => (
              <line
                key={i}
                x1="68"
                y1={y}
                x2="88"
                y2={y}
                stroke="#686c70"
                strokeWidth="2"
                strokeDasharray="2,3"
              />
            ))}

            {/* MOTHERBOARD TRAY (MAIN COMPARTMENT) */}
            <rect
              x="210"
              y="40"
              width="450"
              height="260"
              fill="#181a1d"
              stroke="#383c40"
              strokeWidth="1.5"
            />

            {/* PSU CHAMBER / BASEMENT SHROUD (BOTTOM) */}
            <rect
              x="96"
              y="320"
              width="744"
              height="80"
              fill="#15171a"
              stroke="#33373b"
              strokeWidth="1.5"
            />
            {/* PSU Body */}
            <rect
              x="620"
              y="330"
              width="190"
              height="60"
              fill="#212429"
              stroke="#5a5e63"
              strokeWidth="1.5"
            />
            <text x="640" y="365" fill="#a0a5ab" fontFamily="monospace" fontSize="10" fontWeight="bold">
              PSU ATX 3.0 [{thermalAnalysis.temperatures.psu}°C]
            </text>

            {/* MOTHERBOARD SOCKET VRM ZONE */}
            <rect
              x="280"
              y="60"
              width="150"
              height="110"
              fill="#22252a"
              stroke="#4a4e54"
              strokeWidth="1"
            />
            <text x="290" y="78" fill="#888e95" fontFamily="monospace" fontSize="9">
              VRM POWER PHASES
            </text>

            {/* CPU SOCKET & COOLER (CENTRAL-UPPER) */}
            <g
              onClick={() => setSelectedZone('cpu')}
              className="cursor-pointer"
            >
              <rect
                x="310"
                y="85"
                width="90"
                height="80"
                fill="#2b2f36"
                stroke={selectedZone === 'cpu' ? '#ffffff' : '#0050cc'}
                strokeWidth={selectedZone === 'cpu' ? '2.5' : '1.5'}
                rx="2"
              />
              {/* Dual-Tower Heatsink fins styling */}
              <line x1="320" y1="95" x2="390" y2="95" stroke="#777c82" strokeWidth="1.5" />
              <line x1="320" y1="110" x2="390" y2="110" stroke="#777c82" strokeWidth="1.5" />
              <line x1="320" y1="125" x2="390" y2="125" stroke="#777c82" strokeWidth="1.5" />
              <line x1="320" y1="140" x2="390" y2="140" stroke="#777c82" strokeWidth="1.5" />
              <line x1="320" y1="155" x2="390" y2="155" stroke="#777c82" strokeWidth="1.5" />
              <text x="322" y="130" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="bold">
                CPU {thermalAnalysis.temperatures.cpu}°C
              </text>
            </g>

            {/* RAM SLOTS (RIGHT OF CPU) */}
            <g onClick={() => setSelectedZone('ram')} className="cursor-pointer">
              <rect
                x="415"
                y="80"
                width="14"
                height="85"
                fill="#26292f"
                stroke="#64686e"
                strokeWidth="1"
              />
              <rect
                x="435"
                y="80"
                width="14"
                height="85"
                fill="#26292f"
                stroke="#64686e"
                strokeWidth="1"
              />
              <text
                x="428"
                y="178"
                fill="#b0b5bc"
                fontFamily="monospace"
                fontSize="8"
                textAnchor="middle"
              >
                DDR5
              </text>
            </g>

            {/* M.2 NVME SLOT (BETWEEN CPU AND GPU) */}
            <g onClick={() => setSelectedZone('nvme')} className="cursor-pointer">
              <rect
                x="300"
                y="180"
                width="130"
                height="18"
                fill="#22262d"
                stroke={selectedZone === 'nvme' ? '#ffffff' : '#4a5058'}
                strokeWidth="1"
                rx="1"
              />
              <text x="310" y="193" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold">
                M.2 NVMe [{thermalAnalysis.temperatures.nvme}°C]
              </text>
            </g>

            {/* GPU CARD (MIDDLE-LOWER) */}
            <g
              onClick={() => setSelectedZone('gpu')}
              className="cursor-pointer"
            >
              <rect
                x="250"
                y="215"
                width="290"
                height="65"
                fill="#23272e"
                stroke={selectedZone === 'gpu' ? '#ffffff' : '#0050cc'}
                strokeWidth={selectedZone === 'gpu' ? '2.5' : '1.5'}
                rx="2"
              />
              {/* GPU Fans */}
              <circle cx="320" cy="248" r="22" fill="#181a1d" stroke="#545860" strokeWidth="1.5" />
              <circle cx="440" cy="248" r="22" fill="#181a1d" stroke="#545860" strokeWidth="1.5" />
              <text x="355" y="252" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold">
                GPU {thermalAnalysis.temperatures.gpu}°C
              </text>
              <text x="365" y="266" fill="#888e95" fontFamily="monospace" fontSize="9">
                {thermalAnalysis.gpuTdp}W TDP
              </text>
            </g>

            {/* CHASSIS FANS INTAKE (FRONT) */}
            {/* Fan 1 (Upper intake) */}
            <circle cx="120" cy="110" r="30" fill="#1d2025" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="120" y="114" fill="#38bdf8" fontFamily="monospace" fontSize="9" textAnchor="middle">
              FAN IN 1
            </text>

            {/* Fan 2 (Lower intake towards GPU) */}
            <circle cx="120" cy="240" r="30" fill="#1d2025" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="120" y="244" fill="#38bdf8" fontFamily="monospace" fontSize="9" textAnchor="middle">
              FAN IN 2
            </text>

            {/* Additional Fan / Fan 3 Intake */}
            {hasExtraFansInstalled ? (
              <g>
                <circle cx="120" cy="175" r="28" fill="#182c3f" stroke="#38bdf8" strokeWidth="2" />
                <text
                  x="120"
                  y="179"
                  fill="#38bdf8"
                  fontFamily="monospace"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  FAN IN 3 (PWM)
                </text>
              </g>
            ) : thermalAnalysis.requiresAdditionalFans ? (
              <g onClick={onAddExtraFan} className="cursor-pointer">
                <title>Añadir ventilación adicional recomendada</title>
                <circle
                  cx="120"
                  cy="175"
                  r="28"
                  fill="#2d2218"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
                <text
                  x="120"
                  y="178"
                  fill="#f59e0b"
                  fontFamily="monospace"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  +FAN SUGERIDO
                </text>
              </g>
            ) : null}

            {/* CHASSIS EXHAUST (REAR & TOP) */}
            {/* Rear Exhaust Fan */}
            <circle cx="780" cy="110" r="30" fill="#1d2025" stroke="#f97316" strokeWidth="1.5" />
            <text x="780" y="114" fill="#f97316" fontFamily="monospace" fontSize="9" textAnchor="middle">
              EXHAUST
            </text>

            {/* Top Exhaust slots */}
            <rect x="300" y="22" width="220" height="14" fill="#24272c" stroke="#f97316" strokeWidth="1" />
            <text x="410" y="32" fill="#f97316" fontFamily="monospace" fontSize="8" textAnchor="middle">
              ▲ SALIDA SUPERIOR
            </text>

            {/* ================= LAYER 1: THERMAL HEATMAP OVERLAYS ================= */}
            {viewMode === 'heatmap' && (
              <g className="pointer-events-none transition-opacity duration-300">
                {/* Cold air entry envelope from front */}
                <ellipse cx="140" cy="175" rx="75" ry="120" fill="url(#intakeColdGradient)" />

                {/* VRM Heat zone */}
                <ellipse cx="330" cy="90" rx="90" ry="50" fill="url(#vrmHeatGradient)" />

                {/* CPU Cooler Hotspot */}
                <ellipse cx="355" cy="125" rx="80" ry="60" fill="url(#cpuHeatGradient)" />

                {/* NVMe Radiation Zone */}
                <ellipse cx="365" cy="189" rx="75" ry="25" fill="url(#nvmeHeatGradient)" />

                {/* GPU Core & Backplate Hotspot */}
                <ellipse cx="395" cy="245" rx="150" ry="55" fill="url(#gpuHeatGradient)" />
              </g>
            )}

            {/* ================= LAYER 2: AIRFLOW STREAMLINES & VECTORS ================= */}
            {(viewMode === 'vectors' || viewMode === 'heatmap') && (
              <g className="pointer-events-none">
                {/* Intake streamline 1 (Fresh to CPU) */}
                <path
                  d="M 155 110 Q 230 110 300 110"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  markerEnd="url(#airflowArrowBlue)"
                  className="animate-pulse"
                />

                {/* Intake streamline 2 (Fresh to GPU) */}
                <path
                  d="M 155 240 Q 200 240 245 240"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  markerEnd="url(#airflowArrowBlue)"
                  className="animate-pulse"
                />

                {/* Flow through GPU to rear/top */}
                <path
                  d="M 545 235 Q 660 210 745 130"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  markerEnd="url(#airflowArrowWarm)"
                />

                {/* Flow through CPU Cooler to rear exhaust */}
                <path
                  d="M 405 110 Q 580 110 745 110"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  markerEnd="url(#airflowArrowWarm)"
                />

                {/* Flow from CPU to Top Exhaust */}
                <path
                  d="M 360 80 Q 380 50 410 38"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  markerEnd="url(#airflowArrowWarm)"
                />
              </g>
            )}

            {/* Thermal Sensor Callout Tags */}
            <g className="font-mono text-[9px] font-bold">
              {/* CPU Sensor Tag */}
              <rect x="290" y="38" width="85" height="16" fill="#000000" stroke={cpuColor.hex} strokeWidth="1.5" />
              <text x="295" y="50" fill={cpuColor.hex}>
                CPU: {thermalAnalysis.temperatures.cpu}°C
              </text>

              {/* GPU Sensor Tag */}
              <rect x="490" y="285" width="85" height="16" fill="#000000" stroke={gpuColor.hex} strokeWidth="1.5" />
              <text x="495" y="297" fill={gpuColor.hex}>
                GPU: {thermalAnalysis.temperatures.gpu}°C
              </text>

              {/* Intake Temp Tag */}
              <rect x="95" y="50" width="70" height="16" fill="#000000" stroke="#0050cc" strokeWidth="1" />
              <text x="100" y="62" fill="#38bdf8">
                IN: {thermalAnalysis.ambientC}°C
              </text>

              {/* Exhaust Temp Tag */}
              <rect x="745" y="50" width="85" height="16" fill="#000000" stroke="#f97316" strokeWidth="1" />
              <text x="750" y="62" fill="#f97316">
                EX: {thermalAnalysis.internalAmbient + 12}°C
              </text>
            </g>
          </svg>
        </div>

        {/* Legend Scale */}
        <div className="relative z-10 mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#a0a5ab] uppercase">ESCALA TÉRMICA:</span>
            <div className="flex items-center">
              <span className="px-2 py-0.5 bg-[#0050cc] text-white">20-45°C</span>
              <span className="px-2 py-0.5 bg-sky-700 text-white">46-60°C</span>
              <span className="px-2 py-0.5 bg-amber-500 text-black">61-72°C</span>
              <span className="px-2 py-0.5 bg-orange-600 text-white">73-80°C</span>
              <span className="px-2 py-0.5 bg-red-600 text-white">&gt;80°C</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#a0a5ab]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#38bdf8] inline-block"></span> Flujo de Admisión (Aire Fresco)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#f97316] inline-block"></span> Extracción de Calor Residual
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED SENSOR MATRIX & THERMAL DIAGNOSIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* CPU Zone Card */}
        <div
          onClick={() => setSelectedZone('cpu')}
          className={`p-3 border transition-all cursor-pointer ${
            selectedZone === 'cpu'
              ? 'border-black bg-[#f6f3ec] shadow-xs'
              : 'border-[#c4c7c7] bg-white hover:bg-[#faf9f5]'
          }`}
        >
          <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
            <span className="text-[#444748] uppercase font-bold">ZONA 01 // CPU</span>
            <span className={`px-1.5 py-0.2 font-bold ${cpuColor.badge}`}>
              {thermalAnalysis.temperatures.cpu}°C
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-[15px] font-bold text-black truncate">
            {cpuSlot?.component.name || 'Procesador'}
          </div>
          <div className="mt-1 font-mono text-[10px] text-[#444748] space-y-0.5">
            <div>Consumo: <strong className="text-black">{thermalAnalysis.cpuTdp}W TDP</strong></div>
            <div>Disipador: <span className="text-black font-semibold truncate">{coolerSlot?.component.name.split(' ')[0] || 'AK620'}</span></div>
            <div>Estado: <span className="font-bold text-black">{cpuColor.label}</span></div>
          </div>
        </div>

        {/* GPU Zone Card */}
        <div
          onClick={() => setSelectedZone('gpu')}
          className={`p-3 border transition-all cursor-pointer ${
            selectedZone === 'gpu'
              ? 'border-black bg-[#f6f3ec] shadow-xs'
              : 'border-[#c4c7c7] bg-white hover:bg-[#faf9f5]'
          }`}
        >
          <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
            <span className="text-[#444748] uppercase font-bold">ZONA 02 // GPU</span>
            <span className={`px-1.5 py-0.2 font-bold ${gpuColor.badge}`}>
              {thermalAnalysis.temperatures.gpu}°C
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-[15px] font-bold text-black truncate">
            {gpuSlot?.component.name || 'Tarjeta de Video'}
          </div>
          <div className="mt-1 font-mono text-[10px] text-[#444748] space-y-0.5">
            <div>Consumo: <strong className="text-black">{thermalAnalysis.gpuTdp}W TDP</strong></div>
            <div>Ventilación: <span className="text-black font-semibold">Dual Fan Axial</span></div>
            <div>Estado: <span className="font-bold text-black">{gpuColor.label}</span></div>
          </div>
        </div>

        {/* NVMe SSD Zone Card */}
        <div
          onClick={() => setSelectedZone('nvme')}
          className={`p-3 border transition-all cursor-pointer ${
            selectedZone === 'nvme'
              ? 'border-black bg-[#f6f3ec] shadow-xs'
              : 'border-[#c4c7c7] bg-white hover:bg-[#faf9f5]'
          }`}
        >
          <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
            <span className="text-[#444748] uppercase font-bold">ZONA 03 // NVME</span>
            <span className={`px-1.5 py-0.2 font-bold ${nvmeColor.badge}`}>
              {thermalAnalysis.temperatures.nvme}°C
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-[15px] font-bold text-black truncate">
            {ssdSlot?.component.name || 'Almacenamiento NVMe'}
          </div>
          <div className="mt-1 font-mono text-[10px] text-[#444748] space-y-0.5">
            <div>Radiación GPU: <strong className="text-black">{thermalAnalysis.gpuTdp > 180 ? 'Moderada (+8°C)' : 'Baja'}</strong></div>
            <div>Disipación: <span className="text-black font-semibold">Heatsink M.2 Activo</span></div>
            <div>Estado: <span className="font-bold text-black">{nvmeColor.label}</span></div>
          </div>
        </div>

        {/* VRM & Memory Card */}
        <div
          onClick={() => setSelectedZone('ram')}
          className={`p-3 border transition-all cursor-pointer ${
            selectedZone === 'ram'
              ? 'border-black bg-[#f6f3ec] shadow-xs'
              : 'border-[#c4c7c7] bg-white hover:bg-[#faf9f5]'
          }`}
        >
          <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
            <span className="text-[#444748] uppercase font-bold">ZONA 04 // VRM & RAM</span>
            <span className={`px-1.5 py-0.2 font-bold ${vrmColor.badge}`}>
              {thermalAnalysis.temperatures.vrm}°C
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-[15px] font-bold text-black truncate">
            Fases VRM & DDR5
          </div>
          <div className="mt-1 font-mono text-[10px] text-[#444748] space-y-0.5">
            <div>RAM Temp: <strong className="text-black">{thermalAnalysis.temperatures.ram}°C</strong></div>
            <div>Chamber: <span className="text-black font-semibold">{thermalAnalysis.internalAmbient}°C</span></div>
            <div>Estado: <span className="font-bold text-black">{vrmColor.label}</span></div>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC RECOMMENDATION BANNER */}
      <div
        className={`p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          hasExtraFansInstalled
            ? 'bg-sky-50 border-[#0050cc]'
            : thermalAnalysis.requiresAdditionalFans
            ? 'bg-amber-50 border-amber-600'
            : 'bg-[#f6f3ec] border-black'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 flex items-center justify-center shrink-0 border ${
              hasExtraFansInstalled
                ? 'bg-[#0050cc] text-white border-[#0050cc]'
                : thermalAnalysis.requiresAdditionalFans
                ? 'bg-amber-600 text-white border-amber-800'
                : 'bg-black text-white border-black'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {hasExtraFansInstalled ? 'verified' : thermalAnalysis.requiresAdditionalFans ? 'mode_fan' : 'task_alt'}
            </span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-['Space_Grotesk'] text-[15px] uppercase font-bold text-black tracking-tight">
              {hasExtraFansInstalled
                ? 'Dictamen de Laboratorio: Refrigeración Forzada Activa (+2 Fans PWM)'
                : thermalAnalysis.requiresAdditionalFans
                ? 'Dictamen de Laboratorio: Ventilación Adicional Necesaria'
                : 'Dictamen de Laboratorio: Curva Térmica Certificada'}
            </h4>
            <p className="font-mono text-[11px] text-[#444748] leading-relaxed max-w-2xl">
              {hasExtraFansInstalled
                ? `Se han incorporado 2 ventiladores frontales PWM de 140mm al ensamble. La presión positiva continua garantiza un descenso promedio de -5.5°C en la GPU y -4°C en el slot M.2 NVMe, eliminando cualquier estancamiento térmico.`
                : thermalAnalysis.requiresAdditionalFans
                ? `El ensamble genera una disipación acumulada de ${thermalAnalysis.totalWatts}W TDP (con GPU en ${thermalAnalysis.gpuTdp}W). Se recomienda añadir +${thermalAnalysis.recommendedFanCount} ventiladores suplementarios de 140mm PWM para reforzar la admisión frontal y disipar el calor radiante sobre el slot M.2 y el backplate de la tarjeta gráfica.`
                : `La configuración actual genera ${thermalAnalysis.totalWatts}W TDP, manteniéndose dentro de los límites ideales de disipación para el chasis ${caseSlot?.component.name || 'NZXT H5 Flow'}. No se requieren ventiladores suplementarios de manera mandatoria.`}
            </p>
          </div>
        </div>

        {thermalAnalysis.requiresAdditionalFans && onAddExtraFan && (
          <button
            onClick={onAddExtraFan}
            className="px-4 py-2 bg-amber-600 hover:bg-black text-white font-mono text-[11px] uppercase font-bold transition-colors cursor-pointer border border-amber-800 shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Añadir Ventilación Recomendada</span>
          </button>
        )}
      </div>
    </div>
  );
};
