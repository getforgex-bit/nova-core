import React from 'react';
import { ActiveView } from '../types';
import { NovaCoreEmblem } from './NovaCoreEmblem';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuickQuote: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenQuickQuote,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fcf9f2] border-b border-black">
      <div className="h-16 w-full px-4 md:px-12 flex items-center justify-between gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('inicio-presentacion')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 border border-black bg-white flex items-center justify-center p-0.5 shadow-xs">
              <NovaCoreEmblem size={32} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-['Space_Grotesk'] text-[20px] uppercase tracking-tight text-black font-semibold leading-none">
                  NOVA CORE
                </span>
                <span className="font-mono text-[10px] border border-black px-1 bg-white text-black uppercase font-medium">
                  [SYS.24]
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#444748] uppercase tracking-wider hidden sm:block">
                COMPUTING & ELECTRONIC HARDWARE
              </span>
            </div>
          </button>

          <div className="hidden xl:block h-6 w-px bg-[#c4c7c7]"></div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 h-16">
            <button
              onClick={() => onNavigate('inicio-presentacion')}
              className={`font-mono text-[12px] uppercase tracking-wider transition-colors h-full flex items-center pt-0.5 cursor-pointer ${
                activeView === 'inicio-presentacion'
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-[#444748] hover:text-black'
              }`}
            >
              Inicio / Presentación
            </button>
            <button
              onClick={() => onNavigate('catalogo-de-componentes')}
              className={`font-mono text-[12px] uppercase tracking-wider transition-colors h-full flex items-center pt-0.5 cursor-pointer ${
                activeView === 'catalogo-de-componentes'
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-[#444748] hover:text-black'
              }`}
            >
              Catálogo de Componentes
            </button>
            <button
              onClick={() => onNavigate('ensamblaje-a-medida')}
              className={`font-mono text-[12px] uppercase tracking-wider transition-colors h-full flex items-center pt-0.5 cursor-pointer ${
                activeView === 'ensamblaje-a-medida'
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-[#444748] hover:text-black'
              }`}
            >
              Ensamblaje a Medida
            </button>
            <button
              onClick={() => onNavigate('packs-predeterminados')}
              className={`font-mono text-[12px] uppercase tracking-wider transition-colors h-full flex items-center pt-0.5 cursor-pointer ${
                activeView === 'packs-predeterminados'
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-[#444748] hover:text-black'
              }`}
            >
              Packs Predeterminados
            </button>
            <button
              onClick={() => onNavigate('servicios-tecnicos')}
              className={`font-mono text-[12px] uppercase tracking-wider transition-colors h-full flex items-center pt-0.5 cursor-pointer ${
                activeView === 'servicios-tecnicos'
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-[#444748] hover:text-black'
              }`}
            >
              Servicios Técnicos
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Cotización Rápida CTA */}
          <button
            onClick={onOpenQuickQuote}
            className="hidden sm:inline-flex items-center font-mono text-[12px] uppercase tracking-wider bg-white text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-all duration-150 cursor-pointer font-semibold"
          >
            Cotización Rápida
          </button>

          {/* Cart Icon & Pill */}
          <button
            onClick={onOpenCart}
            className="flex items-center border border-black bg-white px-2 py-1 gap-1.5 hover:bg-[#ebe8e1] transition-colors cursor-pointer"
            title="Abrir Carrito"
          >
            <span className="material-symbols-outlined text-[18px] text-black">
              shopping_bag
            </span>
            <span className="font-mono text-[10px] font-bold text-black">
              [{cartCount.toString().padStart(2, '0')}]
            </span>
          </button>

          {/* Profile Avatar / Indicator */}
          <div
            className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white"
            title="Ingeniero en Turno"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-[#c4c7c7] bg-[#f6f3ec] px-4 py-1.5 gap-4 scrollbar-none">
        <button
          onClick={() => onNavigate('inicio-presentacion')}
          className={`font-mono text-[11px] uppercase tracking-wider whitespace-nowrap ${
            activeView === 'inicio-presentacion' ? 'text-black font-bold underline' : 'text-[#444748]'
          }`}
        >
          Inicio
        </button>
        <button
          onClick={() => onNavigate('catalogo-de-componentes')}
          className={`font-mono text-[11px] uppercase tracking-wider whitespace-nowrap ${
            activeView === 'catalogo-de-componentes' ? 'text-black font-bold underline' : 'text-[#444748]'
          }`}
        >
          Catálogo
        </button>
        <button
          onClick={() => onNavigate('ensamblaje-a-medida')}
          className={`font-mono text-[11px] uppercase tracking-wider whitespace-nowrap ${
            activeView === 'ensamblaje-a-medida' ? 'text-black font-bold underline' : 'text-[#444748]'
          }`}
        >
          Ensamblaje
        </button>
        <button
          onClick={() => onNavigate('packs-predeterminados')}
          className={`font-mono text-[11px] uppercase tracking-wider whitespace-nowrap ${
            activeView === 'packs-predeterminados' ? 'text-black font-bold underline' : 'text-[#444748]'
          }`}
        >
          Packs
        </button>
        <button
          onClick={() => onNavigate('servicios-tecnicos')}
          className={`font-mono text-[11px] uppercase tracking-wider whitespace-nowrap ${
            activeView === 'servicios-tecnicos' ? 'text-black font-bold underline' : 'text-[#444748]'
          }`}
        >
          Servicios
        </button>
      </div>
    </header>
  );
};
