import React from 'react';
import { TechService } from '../types';
import { TECH_SERVICES } from '../data/services';

interface ServicesViewProps {
  onBookService: (service: TechService) => void;
  onOpenRules: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onBookService,
  onOpenRules,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Sub-Header Ribbon */}
      <section className="w-full bg-[#ebe8e1] px-4 md:px-12 py-2 flex flex-wrap items-center justify-between gap-2 text-[#1c1c18] border-b border-black">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0050cc] inline-block animate-pulse"></span>
            LABORATORIO DE CALIBRACIÓN SUIZA • ESD-SAFE ZONE
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#747878]">|</span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#444748] uppercase">
            CERTIFICACIÓN ISO-9001 EN DIAGNÓSTICO
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span className="text-[#444748]">
            BANCO TÉCNICO: <strong className="text-black font-bold">OPERATIVO</strong>
          </span>
          <span className="text-[#747878]">/</span>
          <span className="text-[#0050cc] font-bold">TURNO INMEDIATO</span>
        </div>
      </section>

      {/* Hero Header */}
      <section className="w-full px-4 md:px-12 pt-8 pb-6 bg-[#fcf9f2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] uppercase tracking-wider bg-black text-white px-1.5 py-0.5 font-bold">
                [SRV-DIV]
              </span>
              <span className="font-mono text-[12px] uppercase tracking-wider text-[#444748] font-bold">
                DIVISIÓN DE MANTENIMIENTO & MICROSOLDADURA
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-headline-xl text-black uppercase tracking-tighter leading-none m-0">
              SERVICIOS TÉCNICOS
            </h1>
            <p className="font-sans text-[15px] text-[#444748] max-w-2xl pt-1">
              Intervenciones de alta precisión en hardware para prolongar la vida útil, eliminar
              estrangulamiento térmico (thermal throttling) y recuperar equipos críticos sin
              intermediarios.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between self-stretch pt-2 lg:pt-0">
            <div className="bg-[#f1eee7] p-3 w-full lg:w-auto text-left lg:text-right border border-black shadow-xs">
              <div className="font-mono text-[10px] uppercase text-[#747878] font-bold">
                TIEMPO PROMEDIO ENTREGA
              </div>
              <div className="font-['Space_Grotesk'] text-[20px] text-black tracking-tight font-bold">
                3 A 24 HORAS
              </div>
              <div className="font-mono text-[10px] text-[#0050cc] font-bold mt-0.5">
                GARANTÍA DE LABORATORIO SELLADA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Cards Grid */}
      <section className="w-full px-4 md:px-12 py-8 bg-[#f6f3ec] border-y border-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TECH_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-6 flex flex-col justify-between shadow-xs border border-black"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-2 border-b border-[#ebe8e1]">
                  <span className="font-mono text-[11px] font-bold bg-[#f1eee7] px-2 py-0.5 text-black border border-[#c4c7c7]">
                    {srv.code}
                  </span>
                  <span className="font-mono text-[11px] text-[#0050cc] font-bold uppercase">
                    {srv.duration}
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black font-bold">
                  {srv.title}
                </h3>
                <p className="font-sans text-[14px] text-[#444748] leading-relaxed">
                  {srv.description}
                </p>
                <div className="bg-[#f6f3ec] p-3 border border-[#ebe8e1]">
                  <span className="font-mono text-[10px] text-[#747878] uppercase font-bold block mb-1.5">
                    INCLUIDO EN EL PROTOCOLO:
                  </span>
                  <ul className="font-mono text-[11px] space-y-1.5 text-black">
                    {srv.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#0050cc] font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-[#ebe8e1] mt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-mono text-[10px] text-[#747878] uppercase font-bold">
                    {srv.priceNote || 'TARIFA PLANA'}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold text-black">
                    ${srv.price.toLocaleString('es-MX')}{' '}
                    <span className="font-mono text-[11px] font-normal text-[#747878]">MXN</span>
                  </span>
                </div>
                <button
                  onClick={() => onBookService(srv)}
                  className="w-full font-mono text-[12px] uppercase tracking-wider bg-black text-white py-3 hover:bg-[#0050cc] transition-colors text-center font-bold cursor-pointer border border-black shadow-xs"
                >
                  Agendar Turno Técnico
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industrial Hardware Lab Workbench Preview */}
      <section className="w-full px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 border border-black bg-white">
            <div className="bg-black text-white px-4 py-2 font-mono text-[10px] flex justify-between items-center">
              <span className="uppercase font-bold">FIG 02.1 // ESTACIÓN DE MICROELECTRÓNICA</span>
              <span className="text-[#dae1ff]">DIAGNÓSTICO EN VIVO</span>
            </div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlNh86KILTr4MR_IFMulGPtkVknEOCg__9AaFPRXp_4zGA9TsMvFDUuFkbmKU7tysuQ0IiWN-u8kFOs4AykRVVwWifcegkTlfbciqX3Tnza-xHavFCf56zF9c_s-T3lPFEh209_nLCLV7K-106eX4RRBOgp1a7y1LbCoDZ4z6LEc7olgPOB2Or-DPYHOfq5oCKZzwiwdyGIBAJhQwldcmUEu0K9ZpC7srhKTP_OsQj1yx6P2THmzvdAug4UKAaNS1b2lE"
              alt="Banco de trabajo técnico"
              className="w-full h-72 object-cover grayscale contrast-125"
            />
            <div className="p-3 bg-[#f1eee7] border-t border-black font-mono text-[11px] text-[#444748] flex justify-between">
              <span>CÁMARA TÉRMICA FLIR + OSCILOSCOPIO RIGOL 100MHz</span>
              <span className="text-black font-bold">[LAB-BOG-01]</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold tracking-widest block">
              [CRITERIOS DE EXCELENCIA TÉCNICA]
            </span>
            <h2 className="font-['Space_Grotesk'] text-headline-md uppercase text-black">
              ¿Por qué confiar tu hardware a Nova Core?
            </h2>
            <p className="font-sans text-[14px] text-[#444748] leading-relaxed">
              No tercerizamos ningún procedimiento. Cada estación de trabajo que entra a nuestro
              laboratorio pasa por una inspección termográfica pre y post-servicio con reporte
              impreso entregado al cliente.
            </p>
            <div className="space-y-2 font-mono text-[11px] text-black">
              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <span>POLÍTICA ZERO-BLOATWARE EN TODAS LAS INSTALACIONES</span>
                <span className="text-[#0050cc] font-bold">100% CLEAN</span>
              </div>
              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <span>PASTA TÉRMICA THERMAL GRIZZLY KRYONAUT INCLUIDA</span>
                <span className="text-[#0050cc] font-bold">12.5 W/mK</span>
              </div>
              <div className="p-3 bg-white border border-black flex items-center justify-between">
                <span>SELLO DE GARANTÍA INALTERABLE TRAS PRUEBA DE ESTRÉS</span>
                <span className="text-[#0050cc] font-bold">SELLADO</span>
              </div>
            </div>
            <button
              onClick={onOpenRules}
              className="font-mono text-[11px] uppercase font-bold text-[#0050cc] underline hover:text-black cursor-pointer pt-2 block"
            >
              Consultar Tabla Completa de Tolerancias Térmicas →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
