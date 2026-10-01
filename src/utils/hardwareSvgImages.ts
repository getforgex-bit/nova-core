// High-fidelity vector SVG data URIs for Nova Core hardware components and packs
// Built to ensure 100% reliable, zero-latency, high-resolution rendering without external CDN failures

const encodeSvg = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

// 1. NVIDIA GeForce RTX 4080 Super OC (Triple Fan, Matte Black, RGB Strip, Backplate)
export const SVG_GPU_4080_SUPER = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="gpuBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14171d"/>
      <stop offset="100%" stop-color="#0a0c10"/>
    </linearGradient>
    <linearGradient id="shroudMetal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#282e38"/>
      <stop offset="50%" stop-color="#1b2028"/>
      <stop offset="100%" stop-color="#12151b"/>
    </linearGradient>
    <linearGradient id="fanBladeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#343d4d"/>
      <stop offset="100%" stop-color="#151921"/>
    </linearGradient>
    <linearGradient id="rgbEdge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0050cc"/>
      <stop offset="50%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>

  <!-- Studio Background -->
  <rect width="600" height="400" fill="url(#gpuBg)"/>
  
  <!-- Subtle Grid lines -->
  <g stroke="#1e2430" stroke-width="0.5">
    <line x1="0" y1="100" x2="600" y2="100"/>
    <line x1="0" y1="200" x2="600" y2="200"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="150" y1="0" x2="150" y2="400"/>
    <line x1="300" y1="0" x2="300" y2="400"/>
    <line x1="450" y1="0" x2="450" y2="400"/>
  </g>

  <!-- Shadow below GPU -->
  <ellipse cx="300" cy="335" rx="260" ry="25" fill="#000000" opacity="0.6"/>

  <!-- PCIe Connector Gold Finger (Bottom Left) -->
  <rect x="70" y="295" width="130" height="15" fill="#ca8a04" stroke="#854d0e" stroke-width="1" rx="2"/>
  <rect x="220" y="295" width="40" height="15" fill="#ca8a04" stroke="#854d0e" stroke-width="1" rx="2"/>

  <!-- Main Heatsink Fin Array (Behind Shroud) -->
  <rect x="50" y="85" width="500" height="215" fill="#181e28" stroke="#364052" stroke-width="1" rx="6"/>
  <!-- Aluminum fin slits -->
  <g stroke="#2a3344" stroke-width="1.5">
    ${Array.from({ length: 42 }).map((_, i) => `<line x1="${60 + i * 11.5}" y1="90" x2="${60 + i * 11.5}" y2="295"/>`).join('')}
  </g>

  <!-- Outer Aluminum Armor Shroud -->
  <polygon points="50,90 545,90 540,295 45,295" fill="url(#shroudMetal)" stroke="#475569" stroke-width="2"/>
  <polygon points="60,100 535,100 530,285 55,285" fill="#12161e" stroke="#2b3240" stroke-width="1"/>

  <!-- Top ARGB Lighting Bar -->
  <rect x="65" y="93" width="465" height="5" fill="url(#rgbEdge)" rx="2"/>
  
  <!-- GEFORCE RTX Logo on Side -->
  <text x="80" y="125" fill="#ffffff" font-family="monospace" font-size="13" font-weight="900" letter-spacing="2">GEFORCE RTX 4080 SUPER</text>
  <text x="440" y="125" fill="#0050cc" font-family="monospace" font-size="10" font-weight="bold">16GB GDDR6X</text>

  <!-- Triple Axial-Tech Fans (3x Fans) -->
  <!-- Fan 1 (Left) -->
  <g transform="translate(135, 205)">
    <circle cx="0" cy="0" r="68" fill="#0c0e12" stroke="#333c4d" stroke-width="3"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#1f2530" stroke-width="1.5"/>
    <!-- Blades -->
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => `<path d="M 0 0 C 20 15, 45 35, 58 10 C 50 35, 30 50, 0 0" fill="url(#fanBladeGrad)" transform="rotate(${deg})"/>`).join('')}
    <!-- Center Hub -->
    <circle cx="0" cy="0" r="26" fill="#1e2430" stroke="#0050cc" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="8" fill="#0050cc"/>
  </g>

  <!-- Fan 2 (Center) -->
  <g transform="translate(300, 205)">
    <circle cx="0" cy="0" r="68" fill="#0c0e12" stroke="#333c4d" stroke-width="3"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#1f2530" stroke-width="1.5"/>
    <!-- Blades -->
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => `<path d="M 0 0 C 20 15, 45 35, 58 10 C 50 35, 30 50, 0 0" fill="url(#fanBladeGrad)" transform="rotate(${deg + 20})"/>`).join('')}
    <!-- Center Hub -->
    <circle cx="0" cy="0" r="26" fill="#1e2430" stroke="#0050cc" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="8" fill="#38bdf8"/>
  </g>

  <!-- Fan 3 (Right) -->
  <g transform="translate(465, 205)">
    <circle cx="0" cy="0" r="68" fill="#0c0e12" stroke="#333c4d" stroke-width="3"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#1f2530" stroke-width="1.5"/>
    <!-- Blades -->
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => `<path d="M 0 0 C 20 15, 45 35, 58 10 C 50 35, 30 50, 0 0" fill="url(#fanBladeGrad)" transform="rotate(${deg + 40})"/>`).join('')}
    <!-- Center Hub -->
    <circle cx="0" cy="0" r="26" fill="#1e2430" stroke="#0050cc" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="8" fill="#0050cc"/>
  </g>

  <!-- Rear Metal Bracket with DisplayPorts -->
  <rect x="36" y="80" width="14" height="240" fill="#64748b" stroke="#94a3b8" stroke-width="1" rx="2"/>
  <rect x="38" y="110" width="8" height="18" fill="#1e293b"/>
  <rect x="38" y="140" width="8" height="18" fill="#1e293b"/>
  <rect x="38" y="170" width="8" height="18" fill="#1e293b"/>
  <rect x="38" y="200" width="8" height="22" fill="#1e293b"/>

  <!-- Spec Badges -->
  <rect x="420" y="25" width="140" height="22" fill="#000000" stroke="#0050cc" stroke-width="1" rx="3"/>
  <text x="490" y="39" fill="#0050cc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">ADA LOVELACE // DLSS 3.5</text>
</svg>
`);

// 2. AMD Ryzen 9 9950X Processor (Zen 5, AM5 Socket, Gold Capacitors, Heatspreader)
export const SVG_CPU_9950X = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="cpuBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16181f"/>
      <stop offset="100%" stop-color="#0b0d12"/>
    </linearGradient>
    <linearGradient id="pcbGreen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f3d2e"/>
      <stop offset="100%" stop-color="#062118"/>
    </linearGradient>
    <linearGradient id="ihsMetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="40%" stop-color="#cbd5e1"/>
      <stop offset="70%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <linearGradient id="goldTraces" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="400" fill="url(#cpuBg)"/>
  
  <!-- Subtle circular grid -->
  <circle cx="300" cy="200" r="170" fill="none" stroke="#242b38" stroke-width="0.8" stroke-dasharray="4,4"/>
  <circle cx="300" cy="200" r="130" fill="none" stroke="#242b38" stroke-width="0.8"/>

  <!-- Drop Shadow -->
  <rect x="165" y="65" width="270" height="270" rx="14" fill="#000000" opacity="0.6"/>

  <!-- Substrate Green PCB (Socket AM5 40x40mm) -->
  <rect x="160" y="60" width="280" height="280" rx="12" fill="url(#pcbGreen)" stroke="#10b981" stroke-width="1.5"/>

  <!-- Gold alignment triangle (Top-Left) -->
  <polygon points="175,75 195,75 175,95" fill="#f59e0b"/>

  <!-- Gold Test Pads on PCB Perimeter -->
  ${[80, 110, 140, 170, 200, 230, 260, 290, 320].map((y) => `<circle cx="178" cy="${y}" r="2" fill="url(#goldTraces)"/>`).join('')}
  ${[80, 110, 140, 170, 200, 230, 260, 290, 320].map((y) => `<circle cx="422" cy="${y}" r="2" fill="url(#goldTraces)"/>`).join('')}
  ${[180, 210, 240, 270, 300, 330, 360, 390, 420].map((x) => `<circle cx="${x}" cy="78" r="2" fill="url(#goldTraces)"/>`).join('')}
  ${[180, 210, 240, 270, 300, 330, 360, 390, 420].map((x) => `<circle cx="${x}" cy="322" r="2" fill="url(#goldTraces)"/>`).join('')}

  <!-- AM5 Unique Shaped Integrated Heat Spreader (IHS) with 8 Cutouts -->
  <g transform="translate(195, 95)">
    <!-- Base IHS Nickel-plated Copper -->
    <path d="M 25 0 L 185 0 Q 210 0 210 25 L 210 185 Q 210 210 185 210 L 25 210 Q 0 210 0 185 L 0 25 Q 0 0 25 0 Z" fill="url(#ihsMetal)" stroke="#475569" stroke-width="2"/>
    
    <!-- Capacitors in the 8 outer cutouts -->
    <rect x="25" y="-6" width="22" height="12" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="95" y="-6" width="22" height="12" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="165" y="-6" width="22" height="12" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="25" y="204" width="22" height="12" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="95" y="204" width="22" height="12" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="165" y="204" width="22" height="12" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="-6" y="95" width="12" height="22" fill="#ca8a04" stroke="#713f12" rx="1"/>
    <rect x="204" y="95" width="12" height="22" fill="#ca8a04" stroke="#713f12" rx="1"/>

    <!-- Laser Engravings -->
    <text x="105" y="55" fill="#334155" font-family="'Space Grotesk', sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="1">AMD RYZEN™</text>
    <text x="105" y="85" fill="#0f172a" font-family="'Space Grotesk', sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="1">9 9950X</text>
    
    <text x="105" y="115" fill="#475569" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">100-000001279 • 16C / 32T</text>
    <text x="105" y="132" fill="#475569" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">ZEN 5 ARCHITECTURE • 4nm</text>
    <text x="105" y="150" fill="#0050cc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">SOCKET AM5 • BOOST 5.7GHz</text>

    <!-- 2D Data Matrix barcode -->
    <rect x="92" y="165" width="26" height="26" fill="#334155"/>
    <rect x="96" y="169" width="6" height="6" fill="#cbd5e1"/>
    <rect x="108" y="169" width="6" height="6" fill="#cbd5e1"/>
    <rect x="102" y="177" width="6" height="6" fill="#cbd5e1"/>
  </g>

  <!-- Spec Tag -->
  <rect x="30" y="340" width="160" height="25" fill="#000000" stroke="#f59e0b" stroke-width="1" rx="2"/>
  <text x="110" y="356" fill="#f59e0b" font-family="monospace" font-size="9.5" font-weight="bold" text-anchor="middle">170W TDP // 80MB CACHE</text>
</svg>
`);

// 3. NZXT Kraken Elite 360 RGB LCD (360mm Radiator, 3x ARGB Fans, Circular LCD Block)
export const SVG_AIO_KRAKEN_360 = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="coolerBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101217"/>
      <stop offset="100%" stop-color="#08090c"/>
    </linearGradient>
    <linearGradient id="radMetal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#242933"/>
      <stop offset="50%" stop-color="#181c24"/>
      <stop offset="100%" stop-color="#101319"/>
    </linearGradient>
    <linearGradient id="pumpGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a303c"/>
      <stop offset="100%" stop-color="#13171e"/>
    </linearGradient>
    <linearGradient id="lcdGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0050cc"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#coolerBg)"/>

  <!-- Subtle grid lines -->
  <g stroke="#1a202c" stroke-width="0.5">
    <line x1="0" y1="80" x2="600" y2="80"/>
    <line x1="0" y1="200" x2="600" y2="200"/>
    <line x1="0" y1="320" x2="600" y2="320"/>
  </g>

  <!-- 360mm Radiator Frame (Top) -->
  <rect x="40" y="45" width="520" height="120" rx="6" fill="url(#radMetal)" stroke="#374151" stroke-width="2"/>
  
  <!-- Radiator Micro-fins -->
  <g stroke="#262d3a" stroke-width="1.2">
    ${Array.from({ length: 48 }).map((_, i) => `<line x1="${50 + i * 10.4}" y1="52" x2="${50 + i * 10.4}" y2="158"/>`).join('')}
  </g>

  <!-- 3x 120mm High-Pressure Fans on Radiator -->
  ${[125, 300, 475].map((cx) => `
    <g transform="translate(${cx}, 105)">
      <circle cx="0" cy="0" r="48" fill="#0d1117" stroke="#0050cc" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="42" fill="none" stroke="#1f2733" stroke-width="1"/>
      <circle cx="0" cy="0" r="16" fill="#1b222d" stroke="#38bdf8" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="4" fill="#38bdf8"/>
      <!-- Fan Blades -->
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => `<path d="M 0 0 C 15 10, 30 25, 38 8 C 30 22, 18 30, 0 0" fill="#232b38" transform="rotate(${deg})"/>`).join('')}
    </g>
  `).join('')}

  <!-- Braided Sleeved Tubes (from radiator to pump block) -->
  <!-- Tube 1 (Intake) -->
  <path d="M 480 165 C 480 240, 380 280, 270 290" fill="none" stroke="#2a3240" stroke-width="14" stroke-linecap="round"/>
  <path d="M 480 165 C 480 240, 380 280, 270 290" fill="none" stroke="#151921" stroke-width="8" stroke-linecap="round"/>

  <!-- Tube 2 (Return) -->
  <path d="M 460 165 C 450 255, 360 295, 260 305" fill="none" stroke="#222834" stroke-width="14" stroke-linecap="round"/>
  <path d="M 460 165 C 450 255, 360 295, 260 305" fill="none" stroke="#10131a" stroke-width="8" stroke-linecap="round"/>

  <!-- Rotatable 90° Fittings at Pump -->
  <rect x="250" y="280" width="14" height="14" rx="2" fill="#475569"/>
  <rect x="240" y="295" width="14" height="14" rx="2" fill="#475569"/>

  <!-- Circular Water Block / Pump Head with IPS LCD Display (Bottom Left) -->
  <g transform="translate(160, 290)">
    <!-- Pump Base Bracket -->
    <rect x="-65" y="-65" width="130" height="130" rx="8" fill="#181e28" stroke="#374151" stroke-width="1.5"/>
    <circle cx="-50" cy="-50" r="5" fill="#ca8a04"/>
    <circle cx="50" cy="-50" r="5" fill="#ca8a04"/>
    <circle cx="-50" cy="50" r="5" fill="#ca8a04"/>
    <circle cx="50" cy="50" r="5" fill="#ca8a04"/>

    <!-- Circular Aluminum Pump Body -->
    <circle cx="0" cy="0" r="58" fill="url(#pumpGrad)" stroke="#4b5563" stroke-width="3"/>
    
    <!-- ARGB Ring Halo -->
    <circle cx="0" cy="0" r="52" fill="none" stroke="url(#lcdGlow)" stroke-width="2.5"/>

    <!-- Circular High-Res LCD Screen (640x640 resolution scaled) -->
    <circle cx="0" cy="0" r="46" fill="#030712" stroke="#1e293b" stroke-width="2"/>

    <!-- LCD Telemetry Display Content -->
    <text x="0" y="-18" fill="#94a3b8" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">CPU TEMPERATURE</text>
    <text x="0" y="10" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-size="28" font-weight="bold" text-anchor="middle">38°C</text>
    <text x="0" y="26" fill="#10b981" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">COOLANT: 29.4°C</text>
    <text x="0" y="38" fill="#64748b" font-family="monospace" font-size="6.5" font-weight="bold" text-anchor="middle">PUMP: 2800 RPM</text>
  </g>

  <!-- Branding Badge -->
  <rect x="400" y="340" width="160" height="25" fill="#000000" stroke="#06b6d4" stroke-width="1" rx="2"/>
  <text x="480" y="356" fill="#06b6d4" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">360MM AIO // 280W TDP</text>
</svg>
`);

// 4. Lian Li O11 Dynamic EVO RGB (Dual Chamber Panoramic Tempered Glass Chassis)
export const SVG_CHASSIS_LIANLI = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="chassisBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#13161c"/>
      <stop offset="100%" stop-color="#0a0c10"/>
    </linearGradient>
    <linearGradient id="glassTint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15"/>
      <stop offset="40%" stop-color="#0050cc" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="steelPillar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#333b47"/>
      <stop offset="50%" stop-color="#232933"/>
      <stop offset="100%" stop-color="#14181f"/>
    </linearGradient>
    <linearGradient id="chassisRgb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0050cc"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#chassisBg)"/>

  <!-- Floor reflection -->
  <ellipse cx="300" cy="365" rx="220" ry="18" fill="#000000" opacity="0.7"/>

  <!-- Main Chassis Frame (Dual Chamber ATX Mid Tower) -->
  <rect x="130" y="45" width="340" height="300" rx="6" fill="#141820" stroke="#333d4d" stroke-width="2"/>

  <!-- Left Main Component Chamber (Glass Area) -->
  <rect x="140" y="55" width="245" height="280" fill="#0b0e14" stroke="#252d3a" stroke-width="1.5"/>

  <!-- Top ARGB Continuous Diffuser Strip -->
  <rect x="130" y="46" width="340" height="4" fill="url(#chassisRgb)"/>
  <!-- Bottom ARGB Continuous Diffuser Strip -->
  <rect x="130" y="340" width="340" height="4" fill="url(#chassisRgb)"/>

  <!-- Internal Motherboard Tray Background -->
  <rect x="155" y="70" width="180" height="200" fill="#161c26" stroke="#2e3847" stroke-width="1" rx="2"/>
  
  <!-- Internal GPU Silhouette in PCIe Slot -->
  <rect x="165" y="170" width="160" height="35" rx="2" fill="#242c3b" stroke="#3b82f6" stroke-width="1"/>
  <line x1="170" y1="175" x2="315" y2="175" stroke="#60a5fa" stroke-width="1.5"/>

  <!-- Side Intake Fan Bracket (3x 120mm Fans on Inner Wall) -->
  ${[90, 150, 210].map((y) => `
    <g transform="translate(355, ${y})">
      <rect x="-18" y="-22" width="36" height="44" fill="#181e28" stroke="#374151" rx="2"/>
      <circle cx="0" cy="0" r="16" fill="#0e1219" stroke="#0050cc" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="4" fill="#38bdf8"/>
    </g>
  `).join('')}

  <!-- Panoramic Seamless Tempered Glass Layer (No Corner Pillar!) -->
  <rect x="140" y="55" width="245" height="280" fill="url(#glassTint)" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.4"/>
  <!-- Glass Corner Reflection Highlights -->
  <path d="M 145 60 L 220 60 L 145 135 Z" fill="#ffffff" opacity="0.08"/>
  <path d="M 145 200 L 290 60 L 330 60 L 145 240 Z" fill="#ffffff" opacity="0.04"/>

  <!-- Right Secondary Chamber (PSU / Cable Management Compartment) -->
  <rect x="388" y="55" width="72" height="280" fill="url(#steelPillar)" stroke="#2b3341" stroke-width="1.5"/>
  <!-- Ventilation Mesh Holes in Right Chamber Front -->
  <g stroke="#3a4556" stroke-width="1.2" stroke-dasharray="2,2">
    ${Array.from({ length: 14 }).map((_, i) => `<line x1="400" y1="${75 + i * 18}" x2="450" y2="${75 + i * 18}"/>`).join('')}
  </g>

  <!-- Front I/O Panel (Bottom of Chassis) -->
  <circle cx="405" cy="320" r="4" fill="#ffffff"/>
  <rect x="415" y="318" width="8" height="4" fill="#0050cc"/>
  <rect x="428" y="318" width="8" height="4" fill="#0050cc"/>
  <circle cx="445" cy="320" r="3" fill="#64748b"/>

  <!-- Chassis Feet -->
  <rect x="150" y="345" width="35" height="10" fill="#0a0c10" stroke="#333d4d" rx="2"/>
  <rect x="415" y="345" width="35" height="10" fill="#0a0c10" stroke="#333d4d" rx="2"/>

  <!-- Label Badge -->
  <rect x="30" y="30" width="180" height="22" fill="#000000" stroke="#0050cc" stroke-width="1" rx="2"/>
  <text x="120" y="44" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">PANORAMIC DUAL-CHAMBER</text>
</svg>
`);

// 5. G.Skill Trident Z5 RGB 64GB DDR5 (2x32GB, 6400MHz, Sculpted Lightbar)
export const SVG_RAM_TRIDENT_Z5 = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="ramBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14161d"/>
      <stop offset="100%" stop-color="#090a0e"/>
    </linearGradient>
    <linearGradient id="heatspreader" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2d3340"/>
      <stop offset="40%" stop-color="#1a1e27"/>
      <stop offset="100%" stop-color="#101319"/>
    </linearGradient>
    <linearGradient id="tridentRgb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0050cc"/>
      <stop offset="35%" stop-color="#06b6d4"/>
      <stop offset="70%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#ramBg)"/>

  <!-- Floor shadows -->
  <ellipse cx="260" cy="330" rx="190" ry="18" fill="#000000" opacity="0.7"/>
  <ellipse cx="340" cy="345" rx="190" ry="18" fill="#000000" opacity="0.6"/>

  <!-- Module 1 (Rear Module, slight offset) -->
  <g transform="translate(60, 50)">
    <!-- Gold Pins at Bottom -->
    <rect x="70" y="240" width="360" height="15" fill="#ca8a04" stroke="#854d0e" rx="1"/>
    ${Array.from({ length: 36 }).map((_, i) => `<line x1="${75 + i * 9.8}" y1="240" x2="${75 + i * 9.8}" y2="255" stroke="#713f12" stroke-width="1.2"/>`).join('')}

    <!-- Heatspreader Aluminum Body -->
    <polygon points="60,60 440,60 435,240 65,240" fill="url(#heatspreader)" stroke="#475569" stroke-width="1.5"/>

    <!-- Top Sculpted ARGB Lightbar with Streamline Fins -->
    <polygon points="50,45 450,45 440,60 60,60" fill="url(#tridentRgb)" filter="drop-shadow(0 0 8px rgba(6,182,212,0.6))"/>
    <polygon points="50,45 450,45 440,50 60,50" fill="#ffffff" opacity="0.6"/>
  </g>

  <!-- Module 2 (Front Module, primary focus) -->
  <g transform="translate(90, 85)">
    <!-- Gold Pins at Bottom -->
    <rect x="70" y="240" width="360" height="15" fill="#eab308" stroke="#a16207" rx="1"/>
    <!-- Key notch in center for DDR5 -->
    <rect x="235" y="238" width="12" height="18" fill="#14161d"/>
    ${Array.from({ length: 36 }).map((_, i) => `<line x1="${75 + i * 9.8}" y1="240" x2="${75 + i * 9.8}" y2="255" stroke="#854d0e" stroke-width="1.2"/>`).join('')}

    <!-- Black Anodized Brushed Heatspreader Body -->
    <polygon points="60,60 440,60 435,240 65,240" fill="url(#heatspreader)" stroke="#525f75" stroke-width="2"/>
    
    <!-- Central Brushed Silver Fin Accent -->
    <polygon points="120,70 380,70 360,180 140,180" fill="#202632" stroke="#333e50" stroke-width="1"/>
    
    <!-- Laser Engraved Logo -->
    <text x="250" y="115" fill="#f8fafc" font-family="'Space Grotesk', sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="2">TRIDENT Z5</text>
    <text x="250" y="138" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">RGB DDR5 6400 MT/s</text>
    <text x="250" y="155" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">64GB (2x32GB) • CL32-39-39-102 • 1.40V</text>

    <!-- Top Sculpted Crystalline ARGB Lightbar with Streamline Fins -->
    <polygon points="50,45 450,45 440,60 60,60" fill="url(#tridentRgb)" filter="drop-shadow(0 0 12px rgba(0,80,204,0.8))"/>
    <polygon points="50,45 450,45 440,50 60,50" fill="#ffffff" opacity="0.7"/>

    <!-- Mechanical wing fin tips -->
    <polygon points="50,45 65,60 55,60" fill="#0050cc"/>
    <polygon points="450,45 435,60 445,60" fill="#ec4899"/>
  </g>

  <!-- Spec Tag -->
  <rect x="410" y="25" width="160" height="22" fill="#000000" stroke="#0050cc" stroke-width="1" rx="2"/>
  <text x="490" y="39" fill="#0050cc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">64GB DUAL-KIT // CL32</text>
</svg>
`);

// 6. ASUS ROG Crosshair X870E Hero (High-end AM5 Motherboard, Polymo Lighting, Massive M.2 Armor)
export const SVG_MOBO_X870E = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="moboBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14171e"/>
      <stop offset="100%" stop-color="#0a0c10"/>
    </linearGradient>
    <linearGradient id="pcbBase" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#181c24"/>
      <stop offset="100%" stop-color="#0e1117"/>
    </linearGradient>
    <linearGradient id="heatsinkMetal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#313845"/>
      <stop offset="50%" stop-color="#1e232c"/>
      <stop offset="100%" stop-color="#13171e"/>
    </linearGradient>
    <linearGradient id="polymoRgb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#0050cc"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#moboBg)"/>

  <!-- ATX Board PCB (x: 100, y: 35, width: 400, height: 330) -->
  <rect x="100" y="35" width="400" height="330" rx="8" fill="url(#pcbBase)" stroke="#374151" stroke-width="2"/>

  <!-- I/O Armor Shroud with ROG Logo & Polymo Matrix Display (Top Left) -->
  <polygon points="105,40 210,40 210,175 105,175" fill="url(#heatsinkMetal)" stroke="#475569" stroke-width="1.5"/>
  <rect x="115" y="55" width="80" height="90" fill="url(#polymoRgb)" rx="4" filter="drop-shadow(0 0 10px rgba(139,92,246,0.6))"/>
  <text x="155" y="105" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-size="20" font-weight="900" text-anchor="middle">ROG</text>
  <text x="155" y="125" fill="#f8fafc" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">X870E HERO</text>

  <!-- Top VRM Heatsink Array -->
  <rect x="215" y="40" width="150" height="35" fill="url(#heatsinkMetal)" stroke="#475569" stroke-width="1" rx="2"/>
  <g stroke="#1a202c" stroke-width="1.5">
    ${Array.from({ length: 12 }).map((_, i) => `<line x1="${225 + i * 11}" y1="42" x2="${225 + i * 11}" y2="73"/>`).join('')}
  </g>

  <!-- AM5 CPU Socket (Center Top) -->
  <rect x="225" y="85" width="95" height="95" fill="#cbd5e1" stroke="#64748b" stroke-width="2" rx="4"/>
  <rect x="235" y="95" width="75" height="75" fill="#1e2430" stroke="#475569" stroke-width="1"/>
  <text x="272" y="137" fill="#94a3b8" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">SOCKET AM5</text>
  <line x1="318" y1="85" x2="318" y2="180" stroke="#64748b" stroke-width="3"/> <!-- Socket Lever -->

  <!-- 4x DDR5 DIMM Slots (Right of CPU) -->
  ${[380, 395, 410, 425].map((x, idx) => `
    <rect x="${x}" y="70" width="9" height="135" fill="#0f131a" stroke="${idx % 2 === 1 ? '#0050cc' : '#334155'}" stroke-width="1.2" rx="1"/>
    <line x1="${x + 4.5}" y1="72" x2="${x + 4.5}" y2="203" stroke="#e2e8f0" stroke-width="0.8"/>
  `).join('')}
  <text x="408" y="62" fill="#0050cc" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">DDR5 8000+ (OC)</text>

  <!-- Primary PCIe 5.0 x16 Steel Slot with Q-Release Button -->
  <rect x="140" y="200" width="230" height="12" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" rx="1"/>
  <line x1="145" y1="206" x2="365" y2="206" stroke="#1e293b" stroke-width="1.5"/>
  <polygon points="372,198 384,198 384,214 372,214" fill="#38bdf8"/> <!-- Q-Release -->
  <text x="250" y="196" fill="#38bdf8" font-family="monospace" font-size="7.5" font-weight="bold">PCIe 5.0 x16 REINFORCED</text>

  <!-- Massive M.2 Heatsink Armor with Crosshair Engravings -->
  <rect x="140" y="225" width="230" height="60" fill="url(#heatsinkMetal)" stroke="#475569" stroke-width="1.5" rx="2"/>
  <text x="255" y="260" fill="#f8fafc" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="1">M.2 PCIE 5.0 THERMAL SHIELD</text>

  <!-- Secondary PCIe x16 Slot -->
  <rect x="140" y="300" width="230" height="10" fill="#1e2430" stroke="#475569" stroke-width="1" rx="1"/>

  <!-- Chipset PCH Heatsink (Bottom Right) -->
  <rect x="385" y="225" width="95" height="100" fill="url(#heatsinkMetal)" stroke="#475569" stroke-width="1.5" rx="4"/>
  <circle cx="432" cy="275" r="28" fill="#0b0e14" stroke="#0050cc" stroke-width="1.5"/>
  <text x="432" y="278" fill="#ffffff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">X870E</text>

  <!-- Spec Tag -->
  <rect x="410" y="20" width="160" height="22" fill="#000000" stroke="#8b5cf6" stroke-width="1" rx="2"/>
  <text x="490" y="34" fill="#8b5cf6" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">18+2+2 FASES // USB4 40G</text>
</svg>
`);

// 7. Crucial T700 2TB PCIe Gen5 NVMe SSD (Finned Heatsink, DirectStorage, 12,400 MB/s)
export const SVG_SSD_T700_GEN5 = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="ssdBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12151b"/>
      <stop offset="100%" stop-color="#08090d"/>
    </linearGradient>
    <linearGradient id="heatFins" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2d3542"/>
      <stop offset="50%" stop-color="#1e242e"/>
      <stop offset="100%" stop-color="#12161d"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#ssdBg)"/>
  
  <!-- Shadow -->
  <ellipse cx="300" cy="290" rx="230" ry="20" fill="#000000" opacity="0.65"/>

  <!-- PCB Base (M.2 2280 Form Factor) -->
  <rect x="70" y="130" width="460" height="110" rx="4" fill="#0a1910" stroke="#10b981" stroke-width="1.5"/>

  <!-- Gold M.2 Connector Pins (Right Side) -->
  <rect x="515" y="145" width="22" height="80" fill="#ca8a04" stroke="#854d0e" rx="1"/>
  <rect x="515" y="178" width="22" height="12" fill="#0a1910"/> <!-- M-Key notch -->
  ${Array.from({ length: 16 }).map((_, i) => `<line x1="518" y1="${148 + i * 4.6}" x2="535" y2="${148 + i * 4.6}" stroke="#713f12" stroke-width="1"/>`).join('')}

  <!-- Semi-circular M.2 retention screw notch (Left Side) -->
  <circle cx="70" cy="185" r="8" fill="#12151b" stroke="#10b981" stroke-width="1.5"/>

  <!-- Dual-Tier Aluminum Finned Heatsink -->
  <rect x="90" y="100" width="420" height="165" rx="6" fill="url(#heatFins)" stroke="#475569" stroke-width="2"/>
  
  <!-- Horizontal Fin Cuts for Heat Dissipation -->
  <g stroke="#3a4556" stroke-width="2">
    ${Array.from({ length: 12 }).map((_, i) => `<line x1="100" y1="${110 + i * 12.5}" x2="500" y2="${110 + i * 12.5}"/>`).join('')}
  </g>

  <!-- Copper Heatpipe Accent Core -->
  <rect x="100" y="178" width="400" height="8" rx="4" fill="#d97706" stroke="#b45309" stroke-width="1"/>

  <!-- Faceplate Label -->
  <rect x="140" y="140" width="320" height="85" fill="#0f131a" stroke="#0050cc" stroke-width="1.5" rx="3"/>
  <text x="300" y="170" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="2">CRUCIAL T700</text>
  <text x="300" y="195" fill="#0050cc" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">PCIe Gen 5.0 NVMe M.2 2TB</text>
  <text x="300" y="214" fill="#10b981" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">12,400 MB/s READ • 11,800 MB/s WRITE</text>

  <!-- Spec Tag -->
  <rect x="390" y="30" width="180" height="22" fill="#000000" stroke="#10b981" stroke-width="1" rx="2"/>
  <text x="480" y="44" fill="#10b981" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">PCIE 5.0 // 12,400 MB/S</text>
</svg>
`);

// 8. Corsair HX1000i Platinum ATX 3.0 Modular Power Supply
export const SVG_PSU_HX1000I = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="psuBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14171f"/>
      <stop offset="100%" stop-color="#0a0c10"/>
    </linearGradient>
    <linearGradient id="psuMetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#282f3c"/>
      <stop offset="50%" stop-color="#1a1f28"/>
      <stop offset="100%" stop-color="#101319"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#psuBg)"/>
  
  <!-- Shadow -->
  <ellipse cx="300" cy="350" rx="220" ry="20" fill="#000000" opacity="0.6"/>

  <!-- PSU Main Steel Enclosure -->
  <rect x="80" y="60" width="440" height="270" rx="6" fill="url(#psuMetal)" stroke="#374151" stroke-width="2"/>

  <!-- 140mm Fan Grille (Center) -->
  <circle cx="240" cy="195" r="105" fill="#0f1217" stroke="#475569" stroke-width="2"/>
  <!-- Concentric wire rings -->
  <circle cx="240" cy="195" r="85" fill="none" stroke="#252d3a" stroke-width="1.5"/>
  <circle cx="240" cy="195" r="65" fill="none" stroke="#252d3a" stroke-width="1.5"/>
  <circle cx="240" cy="195" r="45" fill="none" stroke="#252d3a" stroke-width="1.5"/>
  <!-- Fan blades -->
  ${[0, 50, 100, 150, 200, 250, 300].map((deg) => `<path d="M 240 195 C 265 210, 305 235, 315 210" fill="none" stroke="#1c222c" stroke-width="8" transform="rotate(${deg} 240 195)"/>`).join('')}
  <!-- Center Emblem -->
  <circle cx="240" cy="195" r="28" fill="#181e26" stroke="#0050cc" stroke-width="1.5"/>
  <text x="240" y="199" fill="#f8fafc" font-family="'Space Grotesk', sans-serif" font-size="11" font-weight="900" text-anchor="middle">CORSAIR</text>

  <!-- Modular Cable Output Socket Matrix (Right Side) -->
  <rect x="375" y="80" width="130" height="230" fill="#0b0e14" stroke="#2e3745" stroke-width="1.5" rx="3"/>
  <text x="440" y="100" fill="#94a3b8" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">MODULAR OUTPUTS</text>

  <!-- 12V-2x6 / 12VHPWR 600W Connector (Highlighted in Blue) -->
  <rect x="390" y="115" width="45" height="18" fill="#1e293b" stroke="#0050cc" stroke-width="1.5" rx="1"/>
  <text x="412" y="127" fill="#38bdf8" font-family="monospace" font-size="6.5" font-weight="bold" text-anchor="middle">12V-2x6</text>

  <!-- ATX 24P Sockets -->
  <rect x="445" y="115" width="48" height="24" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1"/>
  <rect x="445" y="145" width="48" height="24" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1"/>

  <!-- PCIe / CPU 8P Sockets (6x) -->
  ${[150, 185, 220].map((y) => `
    <rect x="390" y="${y}" width="22" height="22" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1"/>
    <rect x="418" y="${y}" width="22" height="22" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1"/>
  `).join('')}

  <!-- SATA / Peripheral Sockets -->
  <rect x="390" y="255" width="103" height="16" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1"/>
  <rect x="390" y="280" width="103" height="16" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1"/>

  <!-- Side Logo & Specifications -->
  <rect x="95" y="290" width="220" height="28" fill="#000000" stroke="#0050cc" stroke-width="1" rx="2"/>
  <text x="105" y="308" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="900">HX1000i</text>
  <text x="180" y="308" fill="#ca8a04" font-family="monospace" font-size="9" font-weight="bold">80+ PLATINUM</text>
  <text x="260" y="308" fill="#38bdf8" font-family="monospace" font-size="9" font-weight="bold">ATX 3.0</text>
</svg>
`);

// 9. Fractal Design North Charcoal Black (Real Walnut Wood Slat Front, Brass Accents)
export const SVG_CHASSIS_FRACTAL_NORTH = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="fnBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14161a"/>
      <stop offset="100%" stop-color="#0a0c0e"/>
    </linearGradient>
    <linearGradient id="walnutWood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8a532b"/>
      <stop offset="35%" stop-color="#6e3d1b"/>
      <stop offset="70%" stop-color="#542c12"/>
      <stop offset="100%" stop-color="#3d1f0a"/>
    </linearGradient>
    <linearGradient id="charcoalSteel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a2e36"/>
      <stop offset="100%" stop-color="#14171d"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#fnBg)"/>
  
  <!-- Soft shadow -->
  <ellipse cx="300" cy="365" rx="210" ry="18" fill="#000000" opacity="0.65"/>

  <!-- Main Chassis Frame -->
  <rect x="140" y="45" width="320" height="300" rx="4" fill="url(#charcoalSteel)" stroke="#3a424e" stroke-width="2"/>

  <!-- Left Side High-Airflow Mesh Panel -->
  <rect x="150" y="55" width="220" height="280" fill="#101319" stroke="#2c3340" stroke-width="1.5"/>
  <!-- Micro mesh perforations -->
  <g stroke="#1e2430" stroke-width="1" stroke-dasharray="2,2">
    ${Array.from({ length: 18 }).map((_, i) => `<line x1="160" y1="${68 + i * 14}" x2="360" y2="${68 + i * 14}"/>`).join('')}
  </g>

  <!-- Front Fascia with Natural Walnut Wood Slats (Right Side of View) -->
  <rect x="375" y="52" width="75" height="286" fill="#0d0f14" stroke="#252b36" stroke-width="1.5" rx="2"/>
  
  <!-- 7 Vertical Real Walnut Wood Slats with natural grain gradient -->
  ${[382, 392, 402, 412, 422, 432, 442].map((x) => `
    <rect x="${x}" y="56" width="6.5" height="278" rx="2" fill="url(#walnutWood)" stroke="#2b1608" stroke-width="0.8"/>
  `).join('')}

  <!-- Top Front Brass Power Button & I/O -->
  <circle cx="388" cy="48" r="3.5" fill="#d97706" stroke="#b45309" stroke-width="0.8"/>
  <rect x="396" y="46" width="6" height="3" fill="#ca8a04"/>
  <rect x="406" y="46" width="6" height="3" fill="#ca8a04"/>
  <rect x="416" y="46" width="10" height="3" fill="#38bdf8"/> <!-- USB-C 10Gbps -->

  <!-- Elegant Brass Accent Feet -->
  <rect x="160" y="345" width="30" height="10" fill="#b45309" stroke="#78350f" rx="1.5"/>
  <rect x="410" y="345" width="30" height="10" fill="#b45309" stroke="#78350f" rx="1.5"/>

  <!-- Badge Label -->
  <rect x="30" y="30" width="180" height="22" fill="#000000" stroke="#d97706" stroke-width="1" rx="2"/>
  <text x="120" y="44" fill="#d97706" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">REAL WALNUT WOOD // ATX</text>
</svg>
`);

// 10. Flagship Prebuilt: Pack Apex Creator & AI Studio
export const SVG_PACK_APEX_STUDIO = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="apexBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12151d"/>
      <stop offset="100%" stop-color="#08090d"/>
    </linearGradient>
    <linearGradient id="apexGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0050cc"/>
      <stop offset="50%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#apexBg)"/>
  
  <!-- Subtle CAD circuit traces in background -->
  <g stroke="#1b2230" stroke-width="1">
    <path d="M 50 80 L 150 80 L 180 110 L 250 110" fill="none"/>
    <path d="M 450 320 L 400 320 L 370 290 L 300 290" fill="none"/>
    <circle cx="250" cy="110" r="3" fill="#0050cc"/>
    <circle cx="300" cy="290" r="3" fill="#8b5cf6"/>
  </g>

  <!-- Complete High-End Workstation System Rendering -->
  <ellipse cx="300" cy="355" rx="210" ry="18" fill="#000000" opacity="0.7"/>

  <!-- Panoramic Chassis Case -->
  <rect x="160" y="55" width="280" height="285" rx="8" fill="#0f131a" stroke="#333e50" stroke-width="2"/>
  <rect x="170" y="65" width="200" height="265" fill="#080b0f" stroke="#232b38" stroke-width="1"/>

  <!-- Internal 360mm AIO Cooler on Top with Blue Flow -->
  <rect x="180" y="70" width="180" height="22" fill="#1b2330" stroke="#0050cc" stroke-width="1.5" rx="2"/>
  <circle cx="210" cy="81" r="8" fill="#0050cc"/>
  <circle cx="270" cy="81" r="8" fill="#0050cc"/>
  <circle cx="330" cy="81" r="8" fill="#0050cc"/>

  <!-- Liquid Cooler LCD Pump Head -->
  <circle cx="260" cy="140" r="24" fill="#111620" stroke="#06b6d4" stroke-width="2"/>
  <text x="260" y="144" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">38°C</text>

  <!-- 4x DDR5 RAM with ARGB Bar -->
  <rect x="300" y="115" width="16" height="50" fill="#1e293b" stroke="#8b5cf6" stroke-width="1"/>
  <rect x="300" y="115" width="16" height="5" fill="url(#apexGlow)"/>

  <!-- Massive Triple Fan GPU (RTX 4080 Super) with Glowing Side Bar -->
  <rect x="180" y="185" width="180" height="45" rx="3" fill="#1e2430" stroke="#475569" stroke-width="1.5"/>
  <rect x="180" y="185" width="180" height="4" fill="url(#apexGlow)"/>
  <circle cx="215" cy="208" r="14" fill="#0e131a" stroke="#0050cc" stroke-width="1"/>
  <circle cx="260" cy="208" r="14" fill="#0e131a" stroke="#0050cc" stroke-width="1"/>
  <circle cx="305" cy="208" r="14" fill="#0e131a" stroke="#0050cc" stroke-width="1"/>

  <!-- Bottom PSU Shroud & Lighting -->
  <rect x="170" y="280" width="260" height="50" fill="#141922" stroke="#2e3848" stroke-width="1"/>
  <rect x="170" y="280" width="260" height="3" fill="url(#apexGlow)"/>
  <text x="230" y="310" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">NOVA CORE APEX AI</text>

  <!-- Front Glass Reflection Highlight -->
  <path d="M 170 70 L 260 70 L 170 160 Z" fill="#ffffff" opacity="0.06"/>

  <!-- Badge Top -->
  <rect x="30" y="30" width="220" height="24" fill="#000000" stroke="#0050cc" stroke-width="1" rx="3"/>
  <text x="140" y="46" fill="#ffffff" font-family="monospace" font-size="9.5" font-weight="bold" text-anchor="middle">RYZEN 9 9950X + RTX 4080S</text>
</svg>
`);

// 11. Silent Studio Prebuilt: Pack Scandinavian Wood Craft
export const SVG_PACK_WOOD_CRAFT = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="wcBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141518"/>
      <stop offset="100%" stop-color="#0a0b0d"/>
    </linearGradient>
    <linearGradient id="wcWalnut" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8a532b"/>
      <stop offset="50%" stop-color="#6e3d1b"/>
      <stop offset="100%" stop-color="#3d1f0a"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#wcBg)"/>
  
  <ellipse cx="300" cy="355" rx="200" ry="18" fill="#000000" opacity="0.7"/>

  <!-- Fractal North Chassis Base -->
  <rect x="170" y="55" width="260" height="285" rx="6" fill="#16181f" stroke="#333842" stroke-width="2"/>
  
  <!-- Dark Mesh Side -->
  <rect x="180" y="65" width="180" height="265" fill="#0d0f13" stroke="#252933" stroke-width="1"/>
  
  <!-- Walnut Wood Slats Front -->
  <rect x="365" y="62" width="55" height="271" fill="#0b0c0e" stroke="#22262f" rx="2"/>
  ${[370, 378, 386, 394, 402, 410].map((x) => `
    <rect x="${x}" y="66" width="5" height="263" rx="1.5" fill="url(#wcWalnut)"/>
  `).join('')}

  <!-- Noctua D15 Chromax.Black Dual Tower Cooler Silhouette Inside -->
  <rect x="220" y="110" width="75" height="70" fill="#1b1e26" stroke="#475569" stroke-width="1.5" rx="2"/>
  <circle cx="257" cy="145" r="28" fill="#111317" stroke="#333842" stroke-width="2"/>

  <!-- Quiet Acoustic RTX 4070 Ti Super GPU inside -->
  <rect x="190" y="195" width="165" height="40" fill="#1a1d24" stroke="#475569" stroke-width="1.5" rx="2"/>

  <!-- Brass feet -->
  <rect x="185" y="340" width="25" height="8" fill="#b45309" rx="1"/>
  <rect x="390" y="340" width="25" height="8" fill="#b45309" rx="1"/>

  <!-- Spec Tag -->
  <rect x="30" y="30" width="220" height="24" fill="#000000" stroke="#d97706" stroke-width="1" rx="3"/>
  <text x="140" y="46" fill="#d97706" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">NOGAL SUECO // &lt; 20 dB(A)</text>
</svg>
`);

// 12. GPU Variant: ASUS ROG Strix GeForce RTX 4080 Super Pure White OC Edition
export const SVG_GPU_WHITE_OC = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="whiteGpuBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141822"/>
      <stop offset="100%" stop-color="#0a0d14"/>
    </linearGradient>
    <linearGradient id="whiteShroud" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#f1f5f9"/>
      <stop offset="80%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="whiteFanBlade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d1d5db"/>
    </linearGradient>
    <linearGradient id="iceRgbStrip" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#e0f2fe"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>

  <!-- Studio Background -->
  <rect width="600" height="400" fill="url(#whiteGpuBg)"/>

  <!-- Subtle Blueprint Grid -->
  <g stroke="#1e293b" stroke-width="0.5" stroke-dasharray="3,3">
    <line x1="0" y1="100" x2="600" y2="100"/>
    <line x1="0" y1="200" x2="600" y2="200"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="150" y1="0" x2="150" y2="400"/>
    <line x1="300" y1="0" x2="300" y2="400"/>
    <line x1="450" y1="0" x2="450" y2="400"/>
  </g>

  <!-- Ambient Glow & Drop Shadow -->
  <ellipse cx="300" cy="335" rx="260" ry="25" fill="#000000" opacity="0.65"/>
  <ellipse cx="300" cy="330" rx="200" ry="12" fill="#38bdf8" opacity="0.12"/>

  <!-- PCIe Connector Gold Fingers -->
  <rect x="70" y="295" width="130" height="15" fill="#ca8a04" stroke="#854d0e" stroke-width="1" rx="2"/>
  <rect x="220" y="295" width="40" height="15" fill="#ca8a04" stroke="#854d0e" stroke-width="1" rx="2"/>

  <!-- Internal Silver Fin Array -->
  <rect x="50" y="85" width="500" height="215" fill="#334155" stroke="#64748b" stroke-width="1" rx="6"/>
  <g stroke="#475569" stroke-width="1.2">
    ${Array.from({ length: 42 }).map((_, i) => `<line x1="${60 + i * 11.5}" y1="90" x2="${60 + i * 11.5}" y2="295"/>`).join('')}
  </g>

  <!-- Outer Pure White Armor Shroud -->
  <polygon points="50,90 545,90 540,295 45,295" fill="url(#whiteShroud)" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="60,100 535,100 530,285 55,285" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>

  <!-- Ice Blue / White ARGB Top Lightbar -->
  <rect x="65" y="93" width="465" height="5" fill="url(#iceRgbStrip)" rx="2"/>

  <!-- Top Logo & Model Inscriptions -->
  <text x="80" y="125" fill="#0f172a" font-family="monospace" font-size="13" font-weight="900" letter-spacing="2">GEFORCE RTX 4080 SUPER</text>
  <text x="410" y="125" fill="#0284c7" font-family="monospace" font-size="10" font-weight="bold">WHITE OC EDITION</text>

  <!-- Fan 1 (Left) - Pure White Axial -->
  <g transform="translate(135, 205)">
    <circle cx="0" cy="0" r="68" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => `<path d="M 0 0 C 20 15, 45 35, 58 10 C 50 35, 30 50, 0 0" fill="url(#whiteFanBlade)" stroke="#cbd5e1" stroke-width="0.8" transform="rotate(${deg})"/>`).join('')}
    <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
    <circle cx="0" cy="0" r="9" fill="#0284c7"/>
  </g>

  <!-- Fan 2 (Center) - Pure White Axial -->
  <g transform="translate(300, 205)">
    <circle cx="0" cy="0" r="68" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => `<path d="M 0 0 C 20 15, 45 35, 58 10 C 50 35, 30 50, 0 0" fill="url(#whiteFanBlade)" stroke="#cbd5e1" stroke-width="0.8" transform="rotate(${deg + 20})"/>`).join('')}
    <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
    <circle cx="0" cy="0" r="9" fill="#38bdf8"/>
  </g>

  <!-- Fan 3 (Right) - Pure White Axial -->
  <g transform="translate(465, 205)">
    <circle cx="0" cy="0" r="68" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
    ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => `<path d="M 0 0 C 20 15, 45 35, 58 10 C 50 35, 30 50, 0 0" fill="url(#whiteFanBlade)" stroke="#cbd5e1" stroke-width="0.8" transform="rotate(${deg + 40})"/>`).join('')}
    <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
    <circle cx="0" cy="0" r="9" fill="#0284c7"/>
  </g>

  <!-- White Rear Metal Bracket -->
  <rect x="36" y="80" width="14" height="240" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
  <rect x="38" y="110" width="8" height="18" fill="#475569"/>
  <rect x="38" y="140" width="8" height="18" fill="#475569"/>
  <rect x="38" y="170" width="8" height="18" fill="#475569"/>
  <rect x="38" y="200" width="8" height="22" fill="#475569"/>

  <!-- Badge Top Right -->
  <rect x="380" y="25" width="180" height="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.5" rx="3"/>
  <text x="470" y="41" fill="#0284c7" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">GLACIER WHITE // 16GB OC</text>
</svg>
`);

// 13. RAM Variant: G.Skill Trident Z5 Neo RGB Pure White Edition
export const SVG_RAM_WHITE_RGB = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="whiteRamBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141720"/>
      <stop offset="100%" stop-color="#0a0c10"/>
    </linearGradient>
    <linearGradient id="ramWhiteHeatsink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ramRainbowLight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="25%" stop-color="#818cf8"/>
      <stop offset="50%" stop-color="#c084fc"/>
      <stop offset="75%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#whiteRamBg)"/>

  <!-- Subtle Studio Grid -->
  <g stroke="#1e293b" stroke-width="0.5" stroke-dasharray="3,3">
    <line x1="0" y1="200" x2="600" y2="200"/>
    <line x1="300" y1="0" x2="300" y2="400"/>
  </g>

  <!-- Ambient Shadows -->
  <ellipse cx="280" cy="350" rx="220" ry="18" fill="#000000" opacity="0.6"/>

  <!-- RAM STICK 1 (Background Module) -->
  <g transform="translate(60, 60)">
    <!-- Gold Finger Contacts -->
    <rect x="40" y="225" width="400" height="15" fill="#ca8a04" stroke="#854d0e" stroke-width="1" rx="1"/>
    ${Array.from({ length: 48 }).map((_, i) => `<line x1="${50 + i * 8}" y1="225" x2="${50 + i * 8}" y2="238" stroke="#fef08a" stroke-width="1.5"/>`).join('')}

    <!-- White PCB Base -->
    <rect x="35" y="45" width="410" height="180" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="45" y="55" width="390" height="160" fill="url(#ramWhiteHeatsink)" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Brushed Aluminum Silver Fin Inset -->
    <polygon points="65,95 415,95 385,175 65,175" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
    <text x="180" y="145" fill="#0f172a" font-family="'Space Grotesk', monospace" font-size="18" font-weight="900" letter-spacing="3">TRIDENT Z5 RGB</text>

    <!-- Top ARGB Diffuser Lightbar -->
    <rect x="35" y="32" width="410" height="18" rx="5" fill="url(#ramRainbowLight)" stroke="#ffffff" stroke-width="1.5"/>
  </g>

  <!-- RAM STICK 2 (Foreground Module - Staggered) -->
  <g transform="translate(100, 100)">
    <!-- Gold Finger Contacts -->
    <rect x="40" y="225" width="400" height="15" fill="#ca8a04" stroke="#854d0e" stroke-width="1" rx="1"/>
    ${Array.from({ length: 48 }).map((_, i) => `<line x1="${50 + i * 8}" y1="225" x2="${50 + i * 8}" y2="238" stroke="#fef08a" stroke-width="1.5"/>`).join('')}

    <!-- White PCB Base -->
    <rect x="35" y="45" width="410" height="180" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
    <rect x="45" y="55" width="390" height="160" fill="url(#ramWhiteHeatsink)" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Brushed Silver Inset -->
    <polygon points="65,95 415,95 385,175 65,175" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
    <text x="180" y="145" fill="#0f172a" font-family="'Space Grotesk', monospace" font-size="18" font-weight="900" letter-spacing="3">TRIDENT Z5 RGB</text>
    <text x="210" y="165" fill="#0050cc" font-family="monospace" font-size="10" font-weight="bold">DDR5 6400MHz CL32 • WHITE</text>

    <!-- Top ARGB Diffuser Lightbar with Vivid Glow -->
    <rect x="35" y="30" width="410" height="20" rx="5" fill="url(#ramRainbowLight)" stroke="#ffffff" stroke-width="2"/>
  </g>

  <!-- Badge Top -->
  <rect x="30" y="30" width="200" height="24" fill="#ffffff" stroke="#0050cc" stroke-width="1.5" rx="3"/>
  <text x="130" y="46" fill="#0050cc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">DDR5 PURE WHITE RGB KIT</text>
</svg>
`);

// 14. Chassis Variant: Lian Li O11 Vision Pure White Glacier Edition
export const SVG_CHASSIS_WHITE_VISION = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="whiteChassisBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141824"/>
      <stop offset="100%" stop-color="#0a0d14"/>
    </linearGradient>
    <linearGradient id="whiteFrameGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
      <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#whiteChassisBg)"/>

  <!-- Shadow Base -->
  <ellipse cx="300" cy="360" rx="220" ry="20" fill="#000000" opacity="0.6"/>

  <!-- Pure White Chassis Outer Frame (480mm scale) -->
  <rect x="130" y="40" width="340" height="305" rx="8" fill="url(#whiteFrameGrad)" stroke="#cbd5e1" stroke-width="2"/>

  <!-- Bottom Basement / PSU Chamber Shroud -->
  <rect x="140" y="275" width="320" height="60" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" rx="4"/>
  <rect x="150" y="283" width="300" height="3" fill="#38bdf8"/>
  <text x="160" y="315" fill="#475569" font-family="monospace" font-size="10" font-weight="bold">LIAN LI O11 VISION // PURE WHITE</text>

  <!-- 3-Panel Seamless Panoramic Clear Glass Chamber -->
  <rect x="140" y="50" width="320" height="220" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" rx="3"/>
  <rect x="140" y="50" width="320" height="220" fill="url(#glassReflection)"/>

  <!-- Internal Motherboard Tray (White PCB Tray) -->
  <rect x="190" y="65" width="220" height="190" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" rx="4"/>

  <!-- Internal White Components Preview -->
  <!-- AIO Cooler White Radiator on Side Tray -->
  <rect x="415" y="70" width="35" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="2"/>
  <circle cx="432" cy="95" r="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>
  <circle cx="432" cy="150" r="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>
  <circle cx="432" cy="205" r="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>

  <!-- White GPU Horizontal Silhouette -->
  <rect x="200" y="160" width="180" height="42" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
  <rect x="200" y="160" width="180" height="3" fill="#38bdf8"/>
  <text x="215" y="185" fill="#0f172a" font-family="monospace" font-size="8.5" font-weight="bold">ROG STRIX WHITE OC</text>

  <!-- Front Glass Specular Reflection Streak -->
  <polygon points="150,55 240,55 170,260 145,260" fill="#ffffff" opacity="0.15"/>

  <!-- Chrome Aluminium Feet -->
  <rect x="150" y="345" width="35" height="10" fill="#94a3b8" stroke="#64748b" rx="2"/>
  <rect x="415" y="345" width="35" height="10" fill="#94a3b8" stroke="#64748b" rx="2"/>

  <!-- Spec Badge -->
  <rect x="30" y="30" width="220" height="24" fill="#ffffff" stroke="#0050cc" stroke-width="1.5" rx="3"/>
  <text x="140" y="46" fill="#0050cc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">PANORAMIC GLASS // 3-PANEL</text>
</svg>
`);

// 15. Thermal Variant: NZXT Kraken Elite 360 Pure White Edition
export const SVG_AIO_WHITE_LCD = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="whiteAioBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#121620"/>
      <stop offset="100%" stop-color="#080a0f"/>
    </linearGradient>
    <linearGradient id="radiatorWhite" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#whiteAioBg)"/>

  <!-- Ambient Shadows -->
  <ellipse cx="300" cy="350" rx="230" ry="20" fill="#000000" opacity="0.6"/>

  <!-- 360mm White Radiator Top Block -->
  <rect x="50" y="70" width="440" height="100" rx="6" fill="url(#radiatorWhite)" stroke="#cbd5e1" stroke-width="2"/>

  <!-- 3x 120mm Pure White Fans with ARGB Ring -->
  ${[0, 1, 2].map((i) => `
    <g transform="translate(${125 + i * 145}, 120)">
      <circle cx="0" cy="0" r="42" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="38" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      ${[0, 60, 120, 180, 240, 300].map((deg) => `<path d="M 0 0 C 15 10, 30 25, 36 5 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" transform="rotate(${deg})"/>`).join('')}
      <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="5" fill="#38bdf8"/>
    </g>
  `).join('')}

  <!-- White Braided Sleeved Tubes -->
  <path d="M 450 170 C 470 240, 430 300, 350 300" fill="none" stroke="#f1f5f9" stroke-width="12" stroke-linecap="round"/>
  <path d="M 450 170 C 470 240, 430 300, 350 300" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
  <path d="M 430 170 C 450 250, 390 320, 340 320" fill="none" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
  <path d="M 430 170 C 450 250, 390 320, 340 320" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Circular LCD Pump Display Block (Centered Bottom) -->
  <g transform="translate(240, 280)">
    <!-- White Aluminum Housing -->
    <circle cx="0" cy="0" r="52" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
    <circle cx="0" cy="0" r="44" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>

    <!-- High-res LCD Screen Graphics -->
    <text x="0" y="-8" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">CPU TEMP</text>
    <text x="0" y="16" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-size="24" font-weight="900" text-anchor="middle">31°C</text>
    <text x="0" y="30" fill="#22c55e" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">1800 RPM // SILENT</text>
  </g>

  <!-- Spec Tag -->
  <rect x="30" y="30" width="220" height="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.5" rx="3"/>
  <text x="140" y="46" fill="#0284c7" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">KRAKEN 360 LCD // PURE WHITE</text>
</svg>
`);

// 16. SSD Variant: Crucial T700 Gen5 4TB SSD Dual Heatpipe Extreme
export const SVG_SSD_GEN5_HEATSINK = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="ssdGen5Bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141822"/>
      <stop offset="100%" stop-color="#0a0d14"/>
    </linearGradient>
    <linearGradient id="heatsinkGunmetal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="copperPipe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="50%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#ssdGen5Bg)"/>

  <!-- Shadow below SSD -->
  <ellipse cx="300" cy="310" rx="220" ry="18" fill="#000000" opacity="0.6"/>

  <!-- M.2 2280 PCB Form Factor -->
  <g transform="translate(80, 150)">
    <!-- Gold Connector Pins (M-Key) -->
    <rect x="0" y="25" width="22" height="45" fill="#ca8a04" stroke="#854d0e" rx="1"/>
    ${Array.from({ length: 12 }).map((_, i) => `<line x1="${3 + i * 1.5}" y1="26" x2="${3 + i * 1.5}" y2="68" stroke="#fef08a" stroke-width="1"/>`).join('')}

    <!-- Black Matte PCB -->
    <rect x="22" y="10" width="410" height="75" rx="3" fill="#090d14" stroke="#334155" stroke-width="1.5"/>

    <!-- Mounting Semicircle Notch on Right -->
    <circle cx="432" cy="47" r="9" fill="#141822" stroke="#334155" stroke-width="1.5"/>

    <!-- Massive Extruded Heatsink with Heatpipe -->
    <rect x="35" y="-15" width="370" height="95" rx="4" fill="url(#heatsinkGunmetal)" stroke="#475569" stroke-width="2"/>

    <!-- Horizontal Cooling Fins Array -->
    ${[0, 10, 20, 30, 40, 50, 60, 70].map((y) => `
      <line x1="45" y1="${y}" x2="395" y2="${y}" stroke="#64748b" stroke-width="1.5"/>
    `).join('')}

    <!-- Dual Pure Copper Heatpipes Running Through -->
    <rect x="50" y="15" width="350" height="8" rx="4" fill="url(#copperPipe)" stroke="#9a3412" stroke-width="1"/>
    <rect x="50" y="42" width="350" height="8" rx="4" fill="url(#copperPipe)" stroke="#9a3412" stroke-width="1"/>

    <!-- Central Anodized Aluminum Badge Plate -->
    <rect x="130" y="10" width="200" height="48" rx="3" fill="#0f172a" stroke="#0050cc" stroke-width="1.5"/>
    <text x="230" y="28" fill="#ffffff" font-family="'Space Grotesk', monospace" font-size="13" font-weight="900" text-anchor="middle">CRUCIAL T700 4TB</text>
    <text x="230" y="46" fill="#38bdf8" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">12,400 MB/s • PCIe 5.0 NVMe</text>
  </g>

  <!-- Spec Tag -->
  <rect x="30" y="30" width="220" height="24" fill="#000000" stroke="#0050cc" stroke-width="1.5" rx="3"/>
  <text x="140" y="46" fill="#0050cc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">PCIe 5.0 EXTREME // 4TB PRO</text>
</svg>
`);

// 17. Prebuilt Pack Variant: Pack White Glacier Studio
export const SVG_PACK_WHITE_TITAN = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="whiteTitanBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141824"/>
      <stop offset="100%" stop-color="#090c12"/>
    </linearGradient>
    <linearGradient id="iceFlowGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#whiteTitanBg)"/>

  <!-- Subtle Studio Traces -->
  <g stroke="#1e293b" stroke-width="1">
    <path d="M 50 80 L 150 80 L 180 110 L 250 110" fill="none"/>
    <path d="M 450 320 L 400 320 L 370 290 L 300 290" fill="none"/>
    <circle cx="250" cy="110" r="3" fill="#38bdf8"/>
    <circle cx="300" cy="290" r="3" fill="#818cf8"/>
  </g>

  <!-- Ground Drop Shadow -->
  <ellipse cx="300" cy="355" rx="210" ry="18" fill="#000000" opacity="0.6"/>

  <!-- Pure White Panoramic Case Frame -->
  <rect x="160" y="55" width="280" height="285" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="170" y="65" width="200" height="265" fill="#0f172a" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Top 360mm White AIO with Ice Lighting -->
  <rect x="180" y="70" width="180" height="22" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5" rx="2"/>
  <circle cx="210" cy="81" r="8" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>
  <circle cx="270" cy="81" r="8" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>
  <circle cx="330" cy="81" r="8" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>

  <!-- Liquid Cooler LCD Pump Head Display -->
  <circle cx="260" cy="140" r="24" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="260" cy="140" r="20" fill="#0f172a"/>
  <text x="260" y="144" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">31°C</text>

  <!-- 4x Pure White DDR5 RAM Sticks -->
  <rect x="300" y="115" width="16" height="50" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
  <rect x="300" y="115" width="16" height="5" fill="url(#iceFlowGlow)"/>

  <!-- Massive Pure White Triple Fan GPU (RTX 4080 Super White OC) -->
  <rect x="180" y="185" width="180" height="45" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <rect x="180" y="185" width="180" height="4" fill="url(#iceFlowGlow)"/>
  <circle cx="215" cy="208" r="14" fill="#f8fafc" stroke="#38bdf8" stroke-width="1"/>
  <circle cx="260" cy="208" r="14" fill="#f8fafc" stroke="#38bdf8" stroke-width="1"/>
  <circle cx="305" cy="208" r="14" fill="#f8fafc" stroke="#38bdf8" stroke-width="1"/>

  <!-- White PSU Shroud with Ice Blue Accent Strip -->
  <rect x="170" y="280" width="260" height="50" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
  <rect x="170" y="280" width="260" height="3" fill="url(#iceFlowGlow)"/>
  <text x="210" y="310" fill="#475569" font-family="monospace" font-size="9" font-weight="bold">NOVA CORE // WHITE GLACIER</text>

  <!-- Glass Highlight Reflection Streak -->
  <path d="M 170 70 L 260 70 L 170 160 Z" fill="#ffffff" opacity="0.18"/>

  <!-- Badge Top -->
  <rect x="30" y="30" width="220" height="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.5" rx="3"/>
  <text x="140" y="46" fill="#0284c7" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">WHITE GLACIER // STUDIO AI</text>
</svg>
`);
