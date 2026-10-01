import React, { useState } from 'react';
import { TechService } from '../types';

interface ServiceBookingModalProps {
  service: TechService | null;
  onClose: () => void;
  onConfirm: (serviceName: string) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  service,
  onClose,
  onConfirm,
}) => {
  const [clientName, setClientName] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [serviceDate, setServiceDate] = useState('2024-10-15');
  const [notes, setNotes] = useState('');

  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(`${service.code}: ${service.title}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-black shadow-[8px_8px_0px_0px_#000000] z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-[#0050cc] text-white px-1.5 py-0.5 font-bold uppercase">
              {service.code}
            </span>
            <h3 className="font-['Space_Grotesk'] text-[16px] uppercase font-bold tracking-tight">
              Agendar Protocolo Técnico
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#b3c5ff] transition-colors p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-[#f6f3ec] p-3 border border-[#c4c7c7] space-y-1">
            <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold block">
              SERVICIO SELECCIONADO:
            </span>
            <h4 className="font-['Space_Grotesk'] text-[16px] font-bold text-black uppercase">
              {service.title}
            </h4>
            <div className="flex justify-between font-mono text-[11px] text-[#444748] pt-1 border-t border-[#ebe8e1]">
              <span>{service.duration}</span>
              <span className="text-black font-bold">
                ${service.price.toLocaleString('es-MX')} MXN
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-black block">
              Nombre Completo / Empresa:
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="ej. Ing. Carlos Mendoza"
              className="w-full bg-[#f6f3ec] border border-[#c4c7c7] p-2 font-mono text-[12px] text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-black block">
              Equipo / Hardware a Intervenir:
            </label>
            <input
              type="text"
              required
              value={equipmentModel}
              onChange={(e) => setEquipmentModel(e.target.value)}
              placeholder="ej. Torre Custom Ryzen 7 + RTX 4070 / Laptop Workstation"
              className="w-full bg-[#f6f3ec] border border-[#c4c7c7] p-2 font-mono text-[12px] text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-black block">
              Fecha Preferida de Ingreso al Laboratorio:
            </label>
            <input
              type="date"
              required
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full bg-[#f6f3ec] border border-[#c4c7c7] p-2 font-mono text-[12px] text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-black block">
              Síntomas o Requerimientos Particulares:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ej. Temperaturas elevadas en render, solicitud de cambio por Thermal Grizzly Kryonaut..."
              className="w-full bg-[#f6f3ec] border border-[#c4c7c7] p-2 font-mono text-[12px] text-black focus:outline-none focus:border-black"
            ></textarea>
          </div>

          <div className="p-3 bg-[#ebe8e1] border border-[#c4c7c7] flex items-center gap-2 text-[#444748] font-mono text-[10px]">
            <span className="material-symbols-outlined text-[18px] text-[#0050cc]">
              verified_user
            </span>
            <span>Mesa de trabajo ESD-Safe antiestática certificada con pulsera a tierra.</span>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-[#ebe8e1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f1eee7] text-black font-mono text-[11px] uppercase font-bold hover:bg-[#ebe8e1] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white font-mono text-[11px] uppercase font-bold hover:bg-[#0050cc] transition-colors cursor-pointer"
            >
              Generar Turno de Laboratorio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
