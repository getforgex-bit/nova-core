import React from 'react';

interface RulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesDrawer: React.FC<RulesDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside aria-label="Protocolo Hardware" className="relative w-full max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-black z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black text-white p-2 border border-black">
            <span className="font-mono text-[12px] uppercase font-bold tracking-wider">
              [PROTOCOLO HARDWARE]
            </span>
            <button
              onClick={onClose}
              className="material-symbols-outlined text-[20px] hover:text-[#c4c7c7] cursor-pointer"
            >
              close
            </button>
          </div>

          <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black font-bold">
            Reglas de Interoperabilidad
          </h3>

          <div className="space-y-3 font-sans text-[13px] text-[#444748]">
            <div className="bg-[#f1eee7] p-3 border border-[#c4c7c7]">
              <strong className="text-black block font-mono text-[11px] uppercase font-bold mb-1">
                1. Tolerancia Térmica (TDP)
              </strong>
              El disipador o enfriamiento líquido debe exceder en al menos un 25% el TDP especificado
              para picos de turbo boost en CPUs de arquitectura Ryzen y Core.
            </div>

            <div className="bg-[#f1eee7] p-3 border border-[#c4c7c7]">
              <strong className="text-black block font-mono text-[11px] uppercase font-bold mb-1">
                2. Estándar ATX 3.0 / PCIe 5.0
              </strong>
              Las tarjetas gráficas de la serie RTX 4000 requieren fuentes de poder con certificación
              ATX 3.0 que posean conector 12VHPWR dedicado para evitar adaptadores secundarios.
            </div>

            <div className="bg-[#f1eee7] p-3 border border-[#c4c7c7]">
              <strong className="text-black block font-mono text-[11px] uppercase font-bold mb-1">
                3. Perfiles EXPO / XMP
              </strong>
              Las memorias DDR5 a 6000MHz son el punto dulce (1:1 IF frequency) para las placas AM5
              B650 y X670.
            </div>

            <div className="bg-[#f1eee7] p-3 border border-[#c4c7c7]">
              <strong className="text-black block font-mono text-[11px] uppercase font-bold mb-1">
                4. Certificación ESD-Safe
              </strong>
              Todo ensamble y cambio térmico se realiza en laboratorio con conexión a tierra física
              y temperatura controlada a 21°C.
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 font-mono text-[12px] uppercase font-bold tracking-wider hover:bg-[#0050cc] transition-colors cursor-pointer"
          >
            ENTENDIDO • CERRAR PROTOCOLO
          </button>
        </div>
      </aside>
    </div>
  );
};
