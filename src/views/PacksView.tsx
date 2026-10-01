import React, { useState } from 'react';
import { PrebuiltPack, TechService } from '../types';
import { PREBUILT_PACKS } from '../data/packs';
import { TECH_SERVICES } from '../data/services';

interface PacksViewProps {
  onBuyPack: (pack: PrebuiltPack) => void;
  onCustomizePack: (pack: PrebuiltPack) => void;
  onBookService: (service: TechService) => void;
}

export const PacksView: React.FC<PacksViewProps> = ({
  onBuyPack,
  onCustomizePack,
  onBookService,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'oficina' | 'gaming' | 'workstation' | 'ultra'>('all');
  const [selectedPackVariants, setSelectedPackVariants] = useState<Record<string, string>>({});

  const filteredPacks = PREBUILT_PACKS.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="flex flex-col w-full">
      {/* SECTION: SUB-HEADER & MANIFIESTO SUIZO */}
      <section className="w-full px-4 md:px-12 pt-8 pb-6 bg-[#fcf9f2] border-b border-black">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div className="max-w-4xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 tracking-widest uppercase font-bold">
                [CATÁLOGO MATRIZ 2024.4]
              </span>
              <span className="font-mono text-[10px] text-[#0050cc] font-bold uppercase tracking-wider">
                ● VERIFICACIÓN HARDWARE COMPLETA
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-headline-lg uppercase tracking-tight text-black leading-none">
              CONFIGURACIONES PRE-DISEÑADAS Y CERTIFICADAS
            </h1>
            <p className="font-sans text-[16px] text-[#444748] max-w-2xl pt-1">
              Equipos optimizados para diferentes perfiles de uso y presupuestos, probados
              exhaustivamente bajo tolerancias térmicas estrictas por nuestros ingenieros.
            </p>
          </div>

          {/* Live Benchmarking Telemetry Tag */}
          <div className="bg-white p-4 shadow-xs border border-black flex flex-col justify-between min-w-[280px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#ebe8e1]">
              <span className="font-mono text-[10px] uppercase text-[#747878] font-bold">
                PROTOCOLO DE CERTIFICACIÓN
              </span>
              <span className="font-mono text-[10px] font-bold text-black">NC-STD-810</span>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="font-['Space_Grotesk'] text-[24px] text-black font-bold">100%</span>
              <span className="font-mono text-[10px] text-[#444748] uppercase tracking-wider font-semibold">
                ESTABILIDAD TÉRMICA &gt; 72H PRIME95/FURMARK
              </span>
            </div>
            <div className="w-full bg-[#f1eee7] h-1.5 mt-2">
              <div className="bg-[#0050cc] h-1.5 w-full"></div>
            </div>
          </div>
        </div>

        {/* TIER / FILTER SEGMENTATION BAR */}
        <div className="pt-4 border-t border-[#ebe8e1]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase text-[#747878] mr-2 hidden sm:inline font-bold">
                [FILTRADO POR USO]:
              </span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`font-mono text-[11px] px-3.5 py-1.5 uppercase tracking-wider transition-all border cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-black text-white font-bold border-black'
                    : 'bg-[#f1eee7] text-black hover:bg-[#ebe8e1] border-[#c4c7c7]'
                }`}
              >
                Todos [04]
              </button>
              <button
                onClick={() => setFilterCategory('oficina')}
                className={`font-mono text-[11px] px-3.5 py-1.5 uppercase tracking-wider transition-all border cursor-pointer ${
                  filterCategory === 'oficina'
                    ? 'bg-black text-white font-bold border-black'
                    : 'bg-[#f1eee7] text-black hover:bg-[#ebe8e1] border-[#c4c7c7]'
                }`}
              >
                Oficina y Estudio
              </button>
              <button
                onClick={() => setFilterCategory('gaming')}
                className={`font-mono text-[11px] px-3.5 py-1.5 uppercase tracking-wider transition-all border cursor-pointer ${
                  filterCategory === 'gaming'
                    ? 'bg-black text-white font-bold border-black'
                    : 'bg-[#f1eee7] text-black hover:bg-[#ebe8e1] border-[#c4c7c7]'
                }`}
              >
                Gaming Competitivo
              </button>
              <button
                onClick={() => setFilterCategory('workstation')}
                className={`font-mono text-[11px] px-3.5 py-1.5 uppercase tracking-wider transition-all border cursor-pointer ${
                  filterCategory === 'workstation'
                    ? 'bg-black text-white font-bold border-black'
                    : 'bg-[#f1eee7] text-black hover:bg-[#ebe8e1] border-[#c4c7c7]'
                }`}
              >
                Workstation y Simulación
              </button>
              <button
                onClick={() => setFilterCategory('ultra')}
                className={`font-mono text-[11px] px-3.5 py-1.5 uppercase tracking-wider transition-all border cursor-pointer ${
                  filterCategory === 'ultra'
                    ? 'bg-black text-white font-bold border-black'
                    : 'bg-[#f1eee7] text-black hover:bg-[#ebe8e1] border-[#c4c7c7]'
                }`}
              >
                Creadores y 4K
              </button>
            </div>

            <div className="font-mono text-[10px] text-[#444748] uppercase flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#0050cc]">
                verified_user
              </span>
              <span>ENSAMBLAJE SUIZO Y ENVÍO ASEGURADO</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: GRID OF 4 FEATURED PRE-BUILT PACKS */}
      <section className="w-full px-4 md:px-12 py-8 bg-[#f6f3ec]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPacks.map((pack) => {
            const activeVariantId = selectedPackVariants[pack.id] || pack.variants?.[0]?.id;
            const activeVariant = pack.variants?.find((v) => v.id === activeVariantId);

            const effectiveImage = activeVariant?.image || pack.image;
            const effectivePrice =
              activeVariant?.price !== undefined
                ? activeVariant.price
                : pack.price + (activeVariant?.priceDelta || 0);
            const effectiveChassisTag = activeVariant?.chassisTag || pack.chassisTag;
            const effectiveName = activeVariant
              ? `${pack.name} (${activeVariant.name})`
              : pack.name;

            const packForAction: PrebuiltPack = {
              ...pack,
              name: effectiveName,
              price: effectivePrice,
              image: effectiveImage,
              chassisTag: effectiveChassisTag,
              selectedVariantId: activeVariant?.id,
            };

            return (
              <article
                key={pack.id}
                className="bg-white flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow border border-black"
              >
                <div>
                  {/* Header Bar */}
                  <div
                    className={`p-3 flex items-center justify-between border-b border-black ${
                      pack.headerStyle === 'dark'
                        ? 'bg-black text-white'
                        : 'bg-[#ebe8e1] text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 ${
                          pack.headerStyle === 'dark'
                            ? 'bg-[#0050cc] text-white'
                            : pack.headerStyle === 'accent'
                            ? 'bg-[#0050cc] text-white'
                            : 'bg-black text-white'
                        }`}
                      >
                        REF: {pack.ref}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider ${
                          pack.headerStyle === 'dark' ? 'text-[#dae1ff]' : 'text-[#444748]'
                        }`}
                      >
                        {pack.series}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#0050cc] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc]"></span> STOCK
                      DISPONIBLE [{pack.stockCount} UDS]
                    </span>
                  </div>

                  {/* Product Main Meta */}
                  <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <h2 className="font-['Space_Grotesk'] text-[24px] uppercase tracking-tight text-black font-bold">
                        {pack.name}
                      </h2>
                      <div className="inline-block bg-[#f1eee7] px-3 py-1.5 text-black font-sans text-[13px] border border-[#ebe8e1]">
                        <span className="font-mono text-[10px] font-bold uppercase text-black mr-1">
                          IDEAL:
                        </span>{' '}
                        {pack.idealText}
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex flex-col md:items-end justify-start min-w-[160px]">
                      <span className="font-mono text-[10px] text-[#444748] uppercase">
                        PRECIO FINAL (IVA INCL.)
                      </span>
                      <span className="font-['Space_Grotesk'] text-[32px] text-black font-bold leading-none tracking-tight">
                        ${effectivePrice.toLocaleString('es-MX')}
                      </span>
                      <span className="font-mono text-[10px] text-[#747878] uppercase mt-0.5">
                        {pack.monthlyNote}
                      </span>
                    </div>
                  </div>

                  {/* Pack Variants Selector Strip */}
                  {pack.variants && pack.variants.length > 0 && (
                    <div className="mx-6 mb-4 bg-[#f1eee7] p-2.5 border border-black space-y-2">
                      <div className="flex items-center justify-between font-mono text-[9px]">
                        <span className="font-bold text-black uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#0050cc] inline-block animate-pulse"></span>
                          CONFIGURACIÓN / EDICIÓN DISPONIBLE ({pack.variants.length}):
                        </span>
                        <span className="text-[#0050cc] font-bold uppercase">
                          ACTIVO: {activeVariant?.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pack.variants.map((v) => {
                          const isSelected = activeVariant?.id === v.id;
                          const deltaText = v.priceDelta
                            ? v.priceDelta > 0
                              ? `+$${v.priceDelta.toLocaleString('es-MX')}`
                              : `-$${Math.abs(v.priceDelta).toLocaleString('es-MX')}`
                            : v.price && v.price !== pack.price
                            ? `$${v.price.toLocaleString('es-MX')}`
                            : '';

                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() =>
                                setSelectedPackVariants((prev) => ({
                                  ...prev,
                                  [pack.id]: v.id,
                                }))
                              }
                              className={`font-mono text-[10px] px-2.5 py-1.5 uppercase tracking-tight border transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-black text-white border-black font-bold shadow-[2px_2px_0px_0px_#0050cc]'
                                  : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black hover:text-black'
                              }`}
                            >
                              {isSelected ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc] shrink-0"></span>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c4c7c7] shrink-0"></span>
                              )}
                              <span>{v.name}</span>
                              {deltaText && (
                                <span
                                  className={`text-[9px] font-bold ${
                                    isSelected ? 'text-[#38bdf8]' : 'text-[#0050cc]'
                                  }`}
                                >
                                  [{deltaText}]
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {activeVariant?.specsHighlight && (
                        <div className="font-mono text-[10px] text-[#444748] pt-1 border-t border-[#c4c7c7] flex items-center gap-1">
                          <span className="text-[#0050cc] font-bold">★ DETALLE DE EDICIÓN:</span>
                          <span>{activeVariant.specsHighlight}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visual + Benchmark Split */}
                  <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 bg-[#ebe8e1] p-2 relative border border-[#c4c7c7] group">
                      <img
                        src={effectiveImage}
                        alt={effectiveName}
                        referrerPolicy="no-referrer"
                        className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 left-2 bg-black text-white font-mono text-[10px] px-1.5 py-0.5 uppercase font-bold">
                        {effectiveChassisTag}
                      </span>
                    </div>

                  <div className="md:col-span-7 space-y-2 bg-[#f6f3ec] p-4 border border-[#c4c7c7]">
                    <div className="flex justify-between items-center pb-1 border-b border-[#ebe8e1]">
                      <span className="font-mono text-[10px] uppercase font-bold text-black">
                        {pack.benchmarkTitle}
                      </span>
                      <span className="font-mono text-[10px] text-[#747878]">
                        {pack.benchmarkIndex}
                      </span>
                    </div>

                    {pack.metrics.map((m, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between font-mono text-[10px] text-black">
                          <span>{m.label}</span>
                          <span className={`font-bold ${m.highlight ? 'text-[#0050cc]' : ''}`}>
                            {m.value}
                          </span>
                        </div>
                        <div className="w-full bg-[#e5e2db] h-1.5">
                          <div
                            className={`h-1.5 ${m.highlight ? 'bg-[#0050cc]' : 'bg-black'}`}
                            style={{ width: `${m.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strict Spec Matrix Table */}
                <div className="px-6 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#747878] block pb-1 font-bold">
                    DESGLOSE DE COMPONENTES DE PRECISIÓN:
                  </span>
                  <div className="space-y-1 text-black font-mono text-[11px]">
                    {pack.components.map((comp, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-baseline py-1 px-2 ${
                          idx % 2 === 0 ? 'bg-[#f6f3ec]' : 'bg-white'
                        }`}
                      >
                        <span className="text-[#444748] uppercase text-[10px] font-bold">
                          {comp.label}
                        </span>
                        <span className="font-semibold text-black text-right ml-2">
                          {comp.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-4 bg-white mt-4 border-t border-[#ebe8e1]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase text-[#444748] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-[#0050cc]">
                      verified
                    </span>{' '}
                    {pack.warrantyText}
                  </span>
                  <span className="font-mono text-[10px] text-[#747878]">{pack.extraTag}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onBuyPack(packForAction)}
                    className="font-mono text-[12px] uppercase tracking-wider bg-black text-white px-4 py-2.5 hover:bg-[#0050cc] transition-colors text-center font-bold cursor-pointer border border-black shadow-xs"
                  >
                    Comprar Pack Ensamblado
                  </button>
                  <button
                    onClick={() => onCustomizePack(packForAction)}
                    className="font-mono text-[12px] uppercase tracking-wider bg-[#f1eee7] text-black px-4 py-2.5 hover:bg-[#ebe8e1] transition-colors text-center font-bold cursor-pointer border border-black"
                  >
                    Personalizar este Pack
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION: SERVICIOS TÉCNICOS & MANTENIMIENTO */}
      <section className="w-full px-4 md:px-12 py-14 bg-[#fcf9f2] border-t border-black">
        <div className="max-w-4xl pb-8">
          <div className="flex items-center gap-2 pb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider bg-black text-white px-1.5 py-0.5 font-bold">
              [LABORATORIO TÉCNICO]
            </span>
            <span className="font-mono text-[10px] text-[#747878] uppercase tracking-wider font-bold">
              PROTOCOLOS DE MANTENIMIENTO CERTIFICADOS
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-headline-lg uppercase tracking-tight text-black leading-none">
            SERVICIOS DE MANTENIMIENTO Y ACTUALIZACIÓN DE EQUIPOS
          </h2>
          <p className="font-sans text-[15px] text-[#444748] pt-1">
            Extiende la vida útil de tu hardware con calibración térmica suiza, reemplazo de pasta
            conductora de diamante y optimización electromecánica preventiva.
          </p>
        </div>

        {/* Service Catalog Cards Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TECH_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-6 flex flex-col justify-between shadow-xs border border-black"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start pb-1 border-b border-[#ebe8e1]">
                  <span className="font-mono text-[10px] font-bold bg-[#f1eee7] px-1.5 py-0.5 text-black border border-[#c4c7c7]">
                    {srv.code}
                  </span>
                  <span className="font-mono text-[10px] text-[#0050cc] font-bold uppercase">
                    {srv.duration}
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-[18px] uppercase text-black font-bold">
                  {srv.title}
                </h3>
                <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
                  {srv.description}
                </p>
                <ul className="font-mono text-[11px] space-y-1 text-black pt-1">
                  {srv.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-[#0050cc] font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[#ebe8e1] mt-4">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#747878] uppercase font-bold">
                    {srv.priceNote || 'TARIFA PLANA'}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[22px] font-bold text-black">
                    ${srv.price.toLocaleString('es-MX')}{' '}
                    <span className="font-mono text-[10px] font-normal text-[#747878]">MXN</span>
                  </span>
                </div>
                <button
                  onClick={() => onBookService(srv)}
                  className="w-full font-mono text-[11px] uppercase tracking-wider bg-black text-white py-2.5 hover:bg-[#0050cc] transition-colors text-center font-bold cursor-pointer border border-black shadow-xs"
                >
                  Agendar Servicio
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Guarantee Footer Banner */}
        <div className="mt-8 p-4 bg-[#f1eee7] flex flex-col md:flex-row items-center justify-between gap-4 border border-black">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-black">engineering</span>
            <div className="flex flex-col">
              <span className="font-mono text-[12px] font-bold uppercase text-black">
                POLÍTICA DE CALIDAD TOTAL: TALLER LIBRE DE ESTÁTICA (ESD-SAFE)
              </span>
              <span className="font-sans text-[12px] text-[#444748]">
                Todos los servicios se ejecutan sobre tapetes disipativos certificados con pulsera
                continua a tierra física.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookService(TECH_SERVICES[0])}
              className="font-mono text-[11px] uppercase font-bold text-black hover:text-[#0050cc] underline cursor-pointer whitespace-nowrap"
            >
              VER PROTOCOLOS DE LABORATORIO →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
