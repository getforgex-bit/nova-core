import React from 'react';

interface SwissGridLoaderProps {
  query?: string;
  categoryLabel?: string;
}

export const SwissGridLoader: React.FC<SwissGridLoaderProps> = ({
  query,
  categoryLabel,
}) => {
  const gridCells = [
    { id: '01.A', label: 'CPU CORE', code: 'AM5/ZEN4', tdp: '120W' },
    { id: '01.B', label: 'GPU ACCEL', code: 'PCIe 4.0 x16', tdp: '220W' },
    { id: '02.A', label: 'MEM DDR5', code: '6000MT/s CL30', tdp: '1.35V' },
    { id: '02.B', label: 'NVMe GEN4', code: '7300MB/s READ', tdp: 'M.2 2280' },
    { id: '03.A', label: 'CHIPSET B650', code: 'VRM 14+2+1', tdp: 'ATX STD' },
    { id: '03.B', label: 'PSU MODULAR', code: 'ATX 3.0 GOLD', tdp: '850W' },
  ];

  return (
    <div
      role="status"
      aria-label="Cargando y filtrando catálogo de hardware"
      className="w-full bg-[#ffffff] border border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-6 space-y-4 relative overflow-hidden"
    >
      {/* Scanning Laser Hairline Beam */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0050cc] to-transparent pointer-events-none animate-swiss-sweep z-20 opacity-80" />

      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-black pb-3 bg-[#f6f3ec] p-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#0050cc] inline-block animate-ping"></span>
          <span className="font-mono text-[11px] uppercase font-bold text-black tracking-wider">
            [SWISS GRID // RE-INDEXANDO MATRIZ DE HARDWARE]
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-[#444748]">
          {query ? (
            <span>
              FILTRO ACTIVO: <strong className="text-black">&ldquo;{query}&rdquo;</strong>
            </span>
          ) : categoryLabel ? (
            <span>
              CATEGORÍA: <strong className="text-[#0050cc]">{categoryLabel}</strong>
            </span>
          ) : (
            <span>ESCANEANDO SILICIO RAW</span>
          )}
          <span>|</span>
          <span className="text-black font-bold">FRECUENCIA: 120Hz</span>
        </div>
      </div>

      {/* Modular 3x2 Swiss Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gridCells.map((cell, idx) => (
          <div
            key={cell.id}
            className="border border-black bg-[#fcf9f2] p-4 flex flex-col justify-between relative overflow-hidden h-44 animate-swiss-pulse"
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            {/* Corner Crosshairs */}
            <span className="absolute top-1 left-1 font-mono text-[8px] text-[#747878] select-none font-bold">
              +
            </span>
            <span className="absolute top-1 right-1 font-mono text-[8px] text-[#747878] select-none font-bold">
              +
            </span>
            <span className="absolute bottom-1 left-1 font-mono text-[8px] text-[#747878] select-none font-bold">
              +
            </span>
            <span className="absolute bottom-1 right-1 font-mono text-[8px] text-[#747878] select-none font-bold">
              +
            </span>

            {/* Cell Meta Header */}
            <div className="flex items-center justify-between border-b border-[#c4c7c7] pb-1.5">
              <span className="font-mono text-[9px] bg-black text-white px-1 py-0.5 font-bold">
                [{cell.id}]
              </span>
              <span className="font-mono text-[9px] text-[#0050cc] uppercase font-bold tracking-wider">
                {cell.label}
              </span>
            </div>

            {/* Simulated Component Placeholder */}
            <div className="space-y-2 my-auto">
              <div className="h-4 bg-[#ebe8e1] border border-[#c4c7c7] w-3/4 animate-pulse"></div>
              <div className="h-2.5 bg-[#ebe8e1] w-1/2"></div>
              <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-[#747878]">
                <span className="bg-white border border-[#c4c7c7] px-1 py-0.5">{cell.code}</span>
                <span className="bg-white border border-[#c4c7c7] px-1 py-0.5 text-black font-bold">
                  {cell.tdp}
                </span>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between border-t border-[#c4c7c7] pt-1.5 font-mono text-[10px]">
              <span className="text-[#747878]">VERIFICANDO BUS...</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc] animate-pulse"></span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Progress & Verification Status */}
      <div className="bg-black text-white p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#b3c5ff] animate-spin">
            sync
          </span>
          <span>SINCRONIZANDO ALIANZA DE PROVEEDORES CVA / INTCOMEX...</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#dae1ff]">RESOLUCIÓN MATRIZ:</span>
          <span className="text-[#0050cc] bg-white px-1.5 py-0.5 font-bold">99.8% EXACTA</span>
        </div>
      </div>
    </div>
  );
};
