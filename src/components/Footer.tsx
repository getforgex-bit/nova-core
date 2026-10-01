import React from 'react';
import { ActiveView } from '../types';
import { NovaCoreEmblem } from './NovaCoreEmblem';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#f1eee7] border-t border-black">
      <div className="w-full px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Columna Izquierda: Brand & Misión */}
          <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#c4c7c7] pb-8 md:pb-0 md:pr-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 border border-black bg-white flex items-center justify-center p-0.5">
                  <NovaCoreEmblem size={28} />
                </div>
                <span className="font-['Space_Grotesk'] text-[20px] uppercase tracking-tight text-black font-semibold">
                  NOVA CORE
                </span>
                <span className="font-mono text-[10px] border border-black px-1 bg-white text-black font-semibold">
                  ISO-9001
                </span>
              </div>
              <p className="font-sans text-[13px] leading-5 text-[#444748] max-w-md">
                Ingeniería de computación de alto rendimiento, microarquitectura, suministro de
                componentes de precisión y estaciones de trabajo bajo estándar suizo.
              </p>
            </div>

            <div className="pt-8 space-y-1">
              <div className="font-mono text-[10px] uppercase text-[#444748] tracking-wider font-semibold">
                STATUS ARQUITECTURA / MATRIX OPERATIVA
              </div>
              <div className="font-mono text-[10px] text-black flex items-center gap-1.5 font-bold">
                <span className="inline-block w-2 h-2 bg-[#0050cc]"></span> COMPATIBILIDAD
                HARDWARE VERIFICADA: LATAM 100% ONLINE
              </div>
            </div>
          </div>

          {/* Columna Derecha: Índices y Registro */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 pl-0 md:pl-6">
            {/* [01] ÍNDICE */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] block pb-1 border-b border-[#c4c7c7] font-bold">
                [01] ÍNDICE
              </span>
              <ul className="space-y-1">
                <li className="font-mono text-[12px]">
                  <button
                    onClick={() => onNavigate('inicio-presentacion')}
                    className="text-[#444748] hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    Inicio
                  </button>
                </li>
                <li className="font-mono text-[12px]">
                  <button
                    onClick={() => onNavigate('catalogo-de-componentes')}
                    className="text-[#444748] hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    Catálogo
                  </button>
                </li>
                <li className="font-mono text-[12px]">
                  <button
                    onClick={() => onNavigate('ensamblaje-a-medida')}
                    className="text-[#444748] hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    Ensamblaje
                  </button>
                </li>
                <li className="font-mono text-[12px]">
                  <button
                    onClick={() => onNavigate('packs-predeterminados')}
                    className="text-[#444748] hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    Packs
                  </button>
                </li>
              </ul>
            </div>

            {/* [02] SOPORTE */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] block pb-1 border-b border-[#c4c7c7] font-bold">
                [02] SOPORTE
              </span>
              <ul className="space-y-1">
                <li className="font-mono text-[12px]">
                  <button
                    onClick={() => onNavigate('servicios-tecnicos')}
                    className="text-[#444748] hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    Servicio Técnico
                  </button>
                </li>
                <li className="font-mono text-[12px]">
                  <button
                    onClick={() => onNavigate('ensamblaje-a-medida')}
                    className="text-[#444748] hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    Cotizaciones
                  </button>
                </li>
                <li className="font-mono text-[12px]">
                  <span className="text-[#747878] cursor-default uppercase">RMA & Garantías</span>
                </li>
                <li className="font-mono text-[12px]">
                  <span className="text-[#747878] cursor-default uppercase">Telemetría PC</span>
                </li>
              </ul>
            </div>

            {/* [03] REGISTRO */}
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] block pb-1 border-b border-[#c4c7c7] font-bold">
                [03] REGISTRO
              </span>
              <div className="space-y-1 font-mono text-[10px] text-[#444748]">
                <p>BERN - ZURICH - BOG</p>
                <p className="text-black font-bold">SPEC ID: CH-8005-NC</p>
                <p className="text-[#747878]">DIVISIÓN HARDWARE S.A.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior Copyright */}
        <div className="mt-12 pt-4 border-t border-[#c4c7c7] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase text-[#444748]">
            © 2024 NOVA CORE ENGINEERING. TODOS LOS DERECHOS RESERVADOS.
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-[#747878] uppercase">
              PRECISIÓN TIPOGRÁFICA INTERNACIONAL
            </span>
            <span className="font-mono text-[10px] text-black uppercase font-bold">
              SWISS GRID SYSTEM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
