import React from 'react';
import { ConfiguratorSlot, HardwareComponent } from '../types';
import { HARDWARE_CATALOG } from '../data/hardware';
import { validateCpuMoboCompatibility, extractSocket } from '../utils/compatibilityValidator';

interface SlotPickerModalProps {
  slot: ConfiguratorSlot | null;
  allSlots?: ConfiguratorSlot[];
  onClose: () => void;
  onSelectComponent: (slotNumber: string, newComponent: HardwareComponent) => void;
}

export const SlotPickerModal: React.FC<SlotPickerModalProps> = ({
  slot,
  allSlots,
  onClose,
  onSelectComponent,
}) => {
  const [selectedItemVariants, setSelectedItemVariants] = React.useState<Record<string, string>>({});
  if (!slot) return null;

  // Filter components matching the category
  const availableOptions = HARDWARE_CATALOG.filter(
    (c) => c.category === slot.category || (slot.category === 'thermal' && c.category === 'thermal')
  );

  const currentCpu = allSlots?.find((s) => s.category === 'cpu')?.component;
  const currentMobo = allSlots?.find((s) => s.category === 'mobo')?.component;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-black shadow-[8px_8px_0px_0px_#000000] z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-[#0050cc] text-white px-1.5 py-0.5 font-bold">
              SLOT {slot.slotNumber}
            </span>
            <h3 className="font-['Space_Grotesk'] text-[16px] uppercase font-bold tracking-tight">
              Seleccionar {slot.label}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#b3c5ff] transition-colors p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current Selection Bar */}
        <div className="bg-[#f6f3ec] p-3 border-b border-[#c4c7c7] flex items-center justify-between font-mono text-[11px]">
          <span className="text-[#444748] uppercase">SELECCIÓN ACTUAL EN MATRIZ:</span>
          <span className="text-black font-bold truncate max-w-xs">{slot.component.name}</span>
          <span className="text-[#0050cc] font-bold">
            ${slot.component.price.toLocaleString('es-MX')} MXN
          </span>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableOptions.length === 0 ? (
            <div className="p-8 text-center text-[#747878] font-mono text-[12px]">
              No hay variantes adicionales registradas para este slot en el catálogo actual.
            </div>
          ) : (
            availableOptions.map((item) => {
              const isSelected = item.id === slot.component.id;
              const priceDiff = item.price - slot.component.price;

              // Check compatibility preview
              let compatCheck: { isCompatible: boolean; description: string } | null = null;
              if (slot.category === 'cpu' && currentMobo) {
                const res = validateCpuMoboCompatibility(item, currentMobo);
                compatCheck = {
                  isCompatible: res.isCompatible,
                  description: res.isCompatible
                    ? `Compatible con placa actual (${res.moboSocket})`
                    : `Incompatible con placa (${res.cpuSocket} ≠ ${res.moboSocket})`,
                };
              } else if (slot.category === 'mobo' && currentCpu) {
                const res = validateCpuMoboCompatibility(currentCpu, item);
                compatCheck = {
                  isCompatible: res.isCompatible,
                  description: res.isCompatible
                    ? `Compatible con CPU actual (${res.cpuSocket})`
                    : `Incompatible con CPU (${res.cpuSocket} ≠ ${res.moboSocket})`,
                };
              }

              return (
                <div
                  key={item.id}
                  className={`p-3 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-[#0050cc] bg-[#f9f7ff]'
                      : compatCheck && !compatCheck.isCompatible
                      ? 'border-red-400 bg-red-50/60 hover:bg-red-50'
                      : 'border-black bg-white hover:bg-[#f6f3ec]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover border border-[#c4c7c7] bg-[#ebe8e1] shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        <span className="bg-black text-white px-1 font-bold">{item.sku}</span>
                        <span className="text-[#0050cc] font-bold uppercase">{item.brand}</span>
                        {item.tdpWattage && (
                          <span className="text-[#444748]">TDP {item.tdpWattage}W</span>
                        )}
                        {(item.socket || item.category === 'cpu' || item.category === 'mobo') && (
                          <span className="bg-[#1c2024] text-white px-1 font-bold">
                            SOCKET {extractSocket(item)}
                          </span>
                        )}
                        {compatCheck && (
                          <span
                            className={`px-1.5 py-0.5 font-bold uppercase flex items-center gap-1 border ${
                              compatCheck.isCompatible
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                                : 'bg-red-100 text-red-800 border-red-600'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {compatCheck.isCompatible ? 'check_circle' : 'warning'}
                            </span>
                            {compatCheck.description}
                          </span>
                        )}
                      </div>
                      <h4 className="font-['Space_Grotesk'] text-[15px] font-bold uppercase text-black leading-tight">
                        {item.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#444748]">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-[#ebe8e1] gap-2">
                    <div className="text-right">
                      <span className="font-mono text-[14px] font-bold text-black block">
                        ${item.price.toLocaleString('es-MX')} MXN
                      </span>
                      {!isSelected && (
                        <span
                          className={`font-mono text-[10px] font-semibold ${
                            priceDiff > 0 ? 'text-[#ba1a1a]' : 'text-[#0050cc]'
                          }`}
                        >
                          {priceDiff > 0
                            ? `+ $${priceDiff.toLocaleString('es-MX')}`
                            : priceDiff < 0
                            ? `- $${Math.abs(priceDiff).toLocaleString('es-MX')}`
                            : 'Mismo precio'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectComponent(slot.slotNumber, item);
                        onClose();
                      }}
                      className={`px-3 py-1.5 font-mono text-[11px] uppercase font-bold border transition-colors cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-[#0050cc] text-white border-[#0050cc]'
                          : compatCheck && !compatCheck.isCompatible
                          ? 'bg-red-600 text-white border-red-700 hover:bg-red-700'
                          : 'bg-black text-white border-black hover:bg-[#0050cc] hover:border-[#0050cc]'
                      }`}
                    >
                      {isSelected ? 'Activo' : 'Seleccionar'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f1eee7] border-t border-black flex justify-between items-center font-mono text-[11px]">
          <span className="text-[#444748] uppercase">
            Protocolo de Interoperabilidad ATX / PCIe 5.0 Validado
          </span>
          <button
            onClick={onClose}
            className="text-black underline font-bold uppercase hover:text-[#0050cc] cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
