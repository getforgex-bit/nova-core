import React, { useState } from 'react';
import { ActiveView } from '../types';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCustomBuild: () => void;
  onAddToCart: (name: string, price: number) => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  onNavigateToCustomBuild,
  onAddToCart,
}) => {
  const [useCase, setUseCase] = useState<'cad' | 'gaming' | 'office' | 'creator'>('cad');
  const [budget, setBudget] = useState(15000);

  if (!isOpen) return null;

  const quotePresets = {
    cad: {
      title: 'Arquitectura CAD / Render / Ingeniería',
      recommendedCpu: 'AMD Ryzen 7 7700X',
      recommendedGpu: 'GeForce RTX 4070 SUPER 12GB',
      recommendedRam: '32GB DDR5 6000MHz',
      recommendedPsu: '750W 80+ Gold',
      estimatedPrice: Math.max(budget, 24000),
      efficiency: '80 PLUS GOLD',
      leadTime: '< 24H ENSAMBLAJE',
    },
    gaming: {
      title: 'Gaming Competitivo Esports 1080p/1440p',
      recommendedCpu: 'AMD Ryzen 5 7600X / 5600',
      recommendedGpu: 'GeForce RTX 4060 Ti 8GB',
      recommendedRam: '16GB / 32GB DDR5',
      recommendedPsu: '650W 80+ Bronze/Gold',
      estimatedPrice: Math.max(budget, 18500),
      efficiency: '80 PLUS GOLD',
      leadTime: '< 24H ENSAMBLAJE',
    },
    office: {
      title: 'Estación de Trabajo Académica / Oficina Pro',
      recommendedCpu: 'Intel Core i5-12400 / Ryzen 5',
      recommendedGpu: 'Intel UHD 730 Multi-Screen',
      recommendedRam: '16GB DDR4/DDR5 Dual Channel',
      recommendedPsu: '550W 80+ Bronze Silent',
      estimatedPrice: Math.max(budget, 12500),
      efficiency: '80 PLUS BRONZE',
      leadTime: '< 24H ENSAMBLAJE',
    },
    creator: {
      title: 'Workstation 4K / IA & Edición de Video',
      recommendedCpu: 'AMD Ryzen 7 7800X3D',
      recommendedGpu: 'GeForce RTX 4080 SUPER 16GB',
      recommendedRam: '64GB DDR5 Ultra Tight',
      recommendedPsu: '850W ATX 3.0 PCIe 5.0',
      estimatedPrice: Math.max(budget, 42000),
      efficiency: '80 PLUS PLATINUM',
      leadTime: '< 48H CALIBRACIÓN',
    },
  };

  const current = quotePresets[useCase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-black shadow-[8px_8px_0px_0px_#000000] z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-[#0050cc] text-white px-1.5 py-0.5 font-bold uppercase">
              COTIZADOR INTELIGENTE
            </span>
            <h3 className="font-['Space_Grotesk'] text-[16px] uppercase font-bold tracking-tight">
              ¿Tienes un Presupuesto Fijado?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#b3c5ff] transition-colors p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
            Indícanos tu objetivo de uso y cifra límite. Diseñamos la arquitectura balanceando
            procesador, tarjeta gráfica y fuente de poder sin sobrecostes ni cuellos de botella.
          </p>

          {/* Use Case Tabs */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-[#444748] uppercase font-bold block">
              1. SELECCIONA EL TIPO DE CARGA / OBJETIVO:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setUseCase('cad')}
                className={`p-2.5 text-left border font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  useCase === 'cad'
                    ? 'border-black bg-black text-white'
                    : 'border-[#c4c7c7] bg-[#f6f3ec] text-black hover:border-black'
                }`}
              >
                Ingeniería / CAD
              </button>
              <button
                onClick={() => setUseCase('gaming')}
                className={`p-2.5 text-left border font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  useCase === 'gaming'
                    ? 'border-black bg-black text-white'
                    : 'border-[#c4c7c7] bg-[#f6f3ec] text-black hover:border-black'
                }`}
              >
                Gaming Esports
              </button>
              <button
                onClick={() => setUseCase('office')}
                className={`p-2.5 text-left border font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  useCase === 'office'
                    ? 'border-black bg-black text-white'
                    : 'border-[#c4c7c7] bg-[#f6f3ec] text-black hover:border-black'
                }`}
              >
                Oficina / Estudio
              </button>
              <button
                onClick={() => setUseCase('creator')}
                className={`p-2.5 text-left border font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  useCase === 'creator'
                    ? 'border-black bg-black text-white'
                    : 'border-[#c4c7c7] bg-[#f6f3ec] text-black hover:border-black'
                }`}
              >
                Creadores 4K / IA
              </button>
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2 bg-[#f6f3ec] p-4 border border-[#c4c7c7]">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] text-[#444748] uppercase font-bold">
                2. PRESUPUESTO OBJETIVO (MXN):
              </span>
              <span className="font-['Space_Grotesk'] text-[20px] font-bold text-black">
                ${budget.toLocaleString('es-MX')} MXN
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="60000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-[#747878]">
              <span>$10,000 MXN</span>
              <span>$35,000 MXN</span>
              <span>$60,000 MXN</span>
            </div>
          </div>

          {/* Calculated Output Matrix */}
          <div className="bg-[#ffffff] border border-black p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebe8e1]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0050cc]"></span>
                <span className="font-mono text-[11px] uppercase font-bold text-black">
                  CONFIGURACIÓN RECOMENDADA POR NOVA LAB
                </span>
              </div>
              <span className="font-mono text-[10px] bg-[#0050cc] text-white px-2 py-0.5 font-bold uppercase">
                {current.efficiency}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[12px]">
              <div className="bg-[#f6f3ec] p-2 border border-[#c4c7c7]">
                <span className="text-[#747878] text-[10px] block uppercase">CPU ÓPTIMO:</span>
                <span className="text-black font-bold">{current.recommendedCpu}</span>
              </div>
              <div className="bg-[#f6f3ec] p-2 border border-[#c4c7c7]">
                <span className="text-[#747878] text-[10px] block uppercase">ACELERACIÓN GPU:</span>
                <span className="text-black font-bold">{current.recommendedGpu}</span>
              </div>
              <div className="bg-[#f6f3ec] p-2 border border-[#c4c7c7]">
                <span className="text-[#747878] text-[10px] block uppercase">RAM BALISTICA:</span>
                <span className="text-black font-bold">{current.recommendedRam}</span>
              </div>
              <div className="bg-[#f6f3ec] p-2 border border-[#c4c7c7]">
                <span className="text-[#747878] text-[10px] block uppercase">FUENTE SUGERIDA:</span>
                <span className="text-black font-bold">{current.recommendedPsu}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#ebe8e1] font-mono text-[11px]">
              <span className="text-[#444748] uppercase">TIEMPO DE TELEMETRÍA PRE-ENVÍO:</span>
              <span className="text-[#0050cc] font-bold">{current.leadTime}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#f1eee7] border-t border-black flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onAddToCart(`Configuración Express: ${current.title}`, current.estimatedPrice);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-black font-mono text-[12px] uppercase font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Añadir Esta Configuración al Carrito
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToCustomBuild();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-black border border-black font-mono text-[12px] uppercase font-bold text-white hover:bg-[#0050cc] transition-colors cursor-pointer shadow-md"
          >
            Personalizar en Ensamblaje a Medida →
          </button>
        </div>
      </div>
    </div>
  );
};
