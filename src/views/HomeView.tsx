import React from 'react';
import { ActiveView } from '../types';

interface HomeViewProps {
  onNavigate: (view: ActiveView) => void;
  onOpenQuickQuote: () => void;
  onOpenRules: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenQuickQuote,
  onOpenRules,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* SECTION 00: TOP TECHNICAL TELEMETRY & HERO MANIFESTO */}
      <section className="w-full px-4 md:px-12 pt-8 md:pt-14 pb-14">
        {/* Top System Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-center">
          <div className="md:col-span-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] block">
              [INDEX: MANIFIESTO_01]
            </span>
            <span className="font-mono text-[12px] text-black font-bold uppercase tracking-wider">
              NOVA CORE // HARDWARE LAB
            </span>
          </div>

          <div className="md:col-span-6">
            <div className="bg-[#ebe8e1] px-3 py-1 flex items-center justify-between border border-[#c4c7c7]">
              <span className="font-mono text-[10px] text-[#444748] uppercase">
                PROTOCOLO DE CALIDAD SUIZA
              </span>
              <span className="font-mono text-[10px] text-[#0050cc] font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc] inline-block animate-pulse"></span>{' '}
                EN LÍNEA / VERIFICADO 2024
              </span>
            </div>
          </div>

          <div className="md:col-span-3 text-left md:text-right">
            <span className="font-mono text-[10px] uppercase text-[#747878]">
              LOC: 04°35'53"N 74°04'33"W
            </span>
          </div>
        </div>

        {/* Massive Typographic Grid Headline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12">
            <h1 className="font-['Space_Grotesk'] text-headline-xl text-black uppercase tracking-tight leading-none mb-8">
              Hardware con propósito.
              <br />
              <span className="text-[#444748]">Asesoría experta</span> y ensamblaje de precisión.
            </h1>
          </div>

          {/* Left Column: Core Mission Statement */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="bg-white p-8 border border-black shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e5e2db]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#0050cc] font-bold">
                  [DECLARACIÓN DE MISIÓN]
                </span>
                <span className="font-mono text-[10px] text-[#444748]">DOC_ID: NC-MIS-V2</span>
              </div>
              <p className="font-sans text-[18px] leading-relaxed text-[#1c1c18]">
                Proporcionar componentes y accesorios de computadora de calidad a precios
                competitivos, ofreciendo a nuestros clientes productos confiables, asesoría
                especializada y servicios tecnológicos que les permitan satisfacer sus necesidades
                académicas, profesionales, empresariales y de entretenimiento.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('ensamblaje-a-medida')}
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-mono text-[14px] uppercase tracking-wider hover:bg-[#0050cc] transition-colors duration-150 shadow-md font-bold cursor-pointer"
              >
                <span>Diseñar PC a Medida</span>
                <span className="material-symbols-outlined text-[18px]">build</span>
              </button>
              <button
                onClick={() => onNavigate('catalogo-de-componentes')}
                className="inline-flex items-center gap-2 bg-white text-black border border-black px-8 py-4 font-mono text-[14px] uppercase tracking-wider hover:bg-[#e5e2db] transition-colors duration-150 font-bold cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Telemetry Micro-Widget */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-[#ebe8e1] p-6 space-y-4 border border-black">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#444748] uppercase font-bold">
                  [COMPATIBILIDAD DINÁMICA]
                </span>
                <span className="font-mono text-[10px] text-black font-bold">LGA1700 / AM5</span>
              </div>

              {/* Inline Telemetry SVG Matrix */}
              <div className="bg-white p-4 border border-[#c4c7c7]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] uppercase text-[#747878]">
                    Tolerancia Térmica Lab
                  </span>
                  <span className="font-mono text-[10px] text-black font-bold">DELTA T &lt; 32°C</span>
                </div>
                <svg className="w-full h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 320 60">
                  <polyline
                    points="0,48 40,42 80,45 120,28 160,32 200,16 240,20 280,8 320,12"
                    strokeLinecap="square"
                    strokeWidth="2"
                  />
                  <line stroke="#ebe8e1" strokeWidth="1" x1="0" x2="320" y1="52" y2="52" />
                  <line stroke="#ebe8e1" strokeDasharray="2,2" strokeWidth="1" x1="0" x2="320" y1="26" y2="26" />
                  <circle cx="280" cy="8" fill="#0050cc" r="3" stroke="none" />
                </svg>
                <div className="flex justify-between text-[#444748] font-mono text-[10px] mt-1">
                  <span>ESTADO: IDLE</span>
                  <span>CARGA MÁX: E-CORE / P-CORE</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-[#444748] uppercase">Ecosistema Validado</span>
                  <span className="text-black font-bold">INTEL • AMD • NVIDIA • ASUS • CORSAIR</span>
                </div>
                <div className="w-full bg-[#e5e2db] h-1.5">
                  <div className="bg-[#0050cc] h-1.5" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-4 flex items-center justify-between border border-black">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b3c5ff]">verified</span>
                <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">
                  CERTIFICACIÓN ISO-9001 EN ENSAMBLE
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#dae1ff] font-bold">PASS</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: KEY METRIC COUNTERS (SWISS MODULAR CELL MATRIX) */}
      <section className="w-full px-4 md:px-12 py-8 bg-[#ebe8e1] border-y border-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric Cell 01 */}
          <div className="bg-white p-6 flex flex-col justify-between shadow-xs border border-black">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-[#747878] uppercase">[01 / ENSAMBLES]</span>
              <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold">
                VERIFICADO
              </span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-headline-lg text-black font-bold block mb-1">
                +1,200
              </span>
              <p className="font-mono text-[12px] text-[#444748] uppercase">
                Estaciones construidas bajo tolerancias térmicas de laboratorio.
              </p>
            </div>
          </div>

          {/* Metric Cell 02 */}
          <div className="bg-white p-6 flex flex-col justify-between shadow-xs border border-black">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-[#747878] uppercase">[02 / TELEMETRÍA]</span>
              <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold">
                TEST PRE-POST
              </span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-headline-lg text-black font-bold block mb-1">
                99.4%
              </span>
              <p className="font-mono text-[12px] text-[#444748] uppercase">
                Compatibilidad de microcódigo y estabilidad probada en estrés.
              </p>
            </div>
          </div>

          {/* Metric Cell 03 */}
          <div className="bg-white p-6 flex flex-col justify-between shadow-xs border border-black">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-[#747878] uppercase">[03 / COBERTURA]</span>
              <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold">
                RMA IN-HOUSE
              </span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-headline-lg text-black font-bold block mb-1">
                Directa
              </span>
              <p className="font-mono text-[12px] text-[#444748] uppercase">
                Garantía integral y diagnóstico técnico sin intermediarios.
              </p>
            </div>
          </div>

          {/* Metric Cell 04 */}
          <div className="bg-white p-6 flex flex-col justify-between shadow-xs border border-black">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-[#747878] uppercase">[04 / PROVEEDORES]</span>
              <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold">TIER 1</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-headline-lg text-black font-bold block mb-1">
                Oficial
              </span>
              <p className="font-mono text-[12px] text-[#444748] uppercase">
                Canales autorizados AMD, Intel, NVIDIA, ASUS ROG y Corsair.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: VALUE PROPOSITION (3-COLUMN ASYMMETRIC TECHNICAL SUITE) */}
      <section className="w-full px-4 md:px-12 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-black">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#0050cc] font-bold block mb-1">
              [PROPUESTA DE VALOR // MÓDULOS OPERATIVOS]
            </span>
            <h2 className="font-['Space_Grotesk'] text-headline-lg text-black uppercase">
              Estructura Nova Core
            </h2>
          </div>
          <p className="font-sans text-[15px] text-[#444748] max-w-md mt-2 md:mt-0">
            No somos simples distribuidores. Intervenimos el hardware para garantizar máxima
            eficiencia, longevidad y rendimiento por unidad monetaria invertida.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pillar 01 */}
          <div className="bg-white p-8 flex flex-col justify-between shadow-sm border border-black">
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#ebe8e1]">
                <span className="font-mono text-[12px] text-black font-bold uppercase">
                  [01 / SUMINISTRO]
                </span>
                <span className="material-symbols-outlined text-[#0050cc]">memory</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black mb-2 font-bold">
                Componentes de Alto Rendimiento
              </h3>
              <p className="font-sans text-[14px] text-[#444748] mb-4 leading-relaxed">
                Curaduría estricta de microprocesadores, placas madre con VRMs sobredimensionados,
                memorias DDR5 certificadas y matrices de almacenamiento NVMe Gen4/Gen5.
              </p>
              <ul className="space-y-1 font-mono text-[12px] text-[#1c1c18]">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> CPUs: Arquitecturas multi-núcleo 14th Gen & Zen 4/5
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> GPUs: GeForce RTX Serie 40 & Radeon RX 7000
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Almacenamiento: Lectura secuencial hasta 7,400 MB/s
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-[#ebe8e1] flex justify-between items-center">
              <span className="font-mono text-[10px] text-[#747878] uppercase">
                MOD: HARDWARE-SELECT
              </span>
              <button
                onClick={() => onNavigate('catalogo-de-componentes')}
                className="font-mono text-[11px] text-black uppercase font-bold hover:text-[#0050cc] cursor-pointer"
              >
                Ver Catálogo →
              </button>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="bg-white p-8 flex flex-col justify-between shadow-sm border border-black">
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#ebe8e1]">
                <span className="font-mono text-[12px] text-black font-bold uppercase">
                  [02 / TALLER]
                </span>
                <span className="material-symbols-outlined text-[#0050cc]">handyman</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black mb-2 font-bold">
                Servicio Técnico Integral
              </h3>
              <p className="font-sans text-[14px] text-[#444748] mb-4 leading-relaxed">
                Armado milimétrico con enrutamiento de cableado oculto, desensamble de precisión para
                cambio de pasta térmica de compuesto cerámico y mantenimiento preventivo ultrasónico.
              </p>
              <ul className="space-y-1 font-mono text-[12px] text-[#1c1c18]">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Ensamble controlado antiestático ESD
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Actualización modular de memoria y refrigeración
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Diagnóstico de circuitos y micro-soldadura
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-[#ebe8e1] flex justify-between items-center">
              <span className="font-mono text-[10px] text-[#747878] uppercase">
                MOD: LAB-MAINTENANCE
              </span>
              <button
                onClick={() => onNavigate('servicios-tecnicos')}
                className="font-mono text-[11px] text-black uppercase font-bold hover:text-[#0050cc] cursor-pointer"
              >
                Laboratorio →
              </button>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="bg-white p-8 flex flex-col justify-between shadow-sm border border-black">
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#ebe8e1]">
                <span className="font-mono text-[12px] text-black font-bold uppercase">
                  [03 / CONSULTORÍA]
                </span>
                <span className="material-symbols-outlined text-[#0050cc]">calculate</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black mb-2 font-bold">
                Asesoría Tecnológica
              </h3>
              <p className="font-sans text-[14px] text-[#444748] mb-4 leading-relaxed">
                Configuración orientada al presupuesto real. Evaluamos casos como: "¿Tengo $15,000
                para estudiar, programar y jugar?", encontrando la curva exacta entre coste y
                rendimiento sostenido.
              </p>
              <ul className="space-y-1 font-mono text-[12px] text-[#1c1c18]">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Dimensionamiento térmico y de fuentes de poder (PSU)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Estaciones para CAD, Render 3D e Inteligencia Artificial
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#0050cc] font-bold">▪</span> Equipos para Esports y streaming sin cuello de botella
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-[#ebe8e1] flex justify-between items-center">
              <span className="font-mono text-[10px] text-[#747878] uppercase">
                MOD: EXPERT-CONSULT
              </span>
              <button
                onClick={onOpenQuickQuote}
                className="font-mono text-[11px] text-black uppercase font-bold hover:text-[#0050cc] cursor-pointer"
              >
                Cotizar Ahora →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: ARCHITECTURAL FRAME // WORKSHOP WORKBENCH & METHODOLOGY */}
      <section className="w-full px-4 md:px-12 py-14 bg-[#ebe8e1] border-y border-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Industrial Image Frame of Hardware Bench */}
          <div className="lg:col-span-6 flex flex-col border border-black bg-white">
            <div className="flex items-center justify-between bg-black text-white px-4 py-2 font-mono text-[10px]">
              <span className="uppercase tracking-wider font-bold">
                FIG 01.0 // BANCO TÉCNICO DE ENSAMBLAJE Y SOLDADURA
              </span>
              <span className="text-[#dae1ff]">LIVE WORKBENCH</span>
            </div>
            <div className="relative flex-1 bg-white overflow-hidden min-h-[360px]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlNh86KILTr4MR_IFMulGPtkVknEOCg__9AaFPRXp_4zGA9TsMvFDUuFkbmKU7tysuQ0IiWN-u8kFOs4AykRVVwWifcegkTlfbciqX3Tnza-xHavFCf56zF9c_s-T3lPFEh209_nLCLV7K-106eX4RRBOgp1a7y1LbCoDZ4z6LEc7olgPOB2Or-DPYHOfq5oCKZzwiwdyGIBAJhQwldcmUEu0K9ZpC7srhKTP_OsQj1yx6P2THmzvdAug4UKAaNS1b2lE"
                alt="Laboratorio de servicio técnico Nova Core donde un especialista analiza y suelda una placa de circuito impreso con multímetro y cautín sobre una mesa técnica industrial"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-1.5 shadow-sm border border-black">
                <span className="font-mono text-[10px] text-black font-bold uppercase tracking-wider">
                  INGENIERÍA APLICADA DIRECTA
                </span>
              </div>
            </div>
            <div className="bg-[#f1eee7] px-4 py-2 flex justify-between items-center border-t border-black">
              <span className="font-mono text-[10px] text-[#444748] uppercase">
                EQUIPAMIENTO: MULTÍMETRO DIGITAL CALIBRADO / ESTACIÓN TÉRMICA
              </span>
              <span className="font-mono text-[10px] text-black font-bold">[NC-LAB-1]</span>
            </div>
          </div>

          {/* Right: Structured Step-by-Step Technical Protocol */}
          <div className="lg:col-span-6 bg-white p-8 flex flex-col justify-between border border-black">
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#ebe8e1]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#0050cc] font-bold">
                  [PROTOCOLO METODOLÓGICO 4-ETAPAS]
                </span>
                <span className="font-mono text-[10px] text-[#444748] uppercase font-bold">
                  CONTROL RIGUROSO
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-headline-md uppercase text-black mb-6">
                Metodología de Trabajo y Garantía
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-[#ebe8e1] border border-black flex items-center justify-center font-mono text-[12px] font-bold text-black shrink-0">
                    01
                  </span>
                  <div>
                    <h4 className="font-mono text-[13px] uppercase text-black font-bold">
                      Verificación y Validación Pre-Ensamble
                    </h4>
                    <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
                      Chequeo de compatibilidad eléctrica, tolerancias de pines y actualización preventiva de BIOS/UEFI en banco de prueba previo al montaje en chasis.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-[#ebe8e1] border border-black flex items-center justify-center font-mono text-[12px] font-bold text-black shrink-0">
                    02
                  </span>
                  <div>
                    <h4 className="font-mono text-[13px] uppercase text-black font-bold">
                      Ensamble Mecánico y Gestión Térmica
                    </h4>
                    <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
                      Fijación con torquímetro para montaje uniforme de disipadores, aplicación de interfaz térmica de alta conductividad y enrutamiento aerodinámico de cableado.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-[#ebe8e1] border border-black flex items-center justify-center font-mono text-[12px] font-bold text-black shrink-0">
                    03
                  </span>
                  <div>
                    <h4 className="font-mono text-[13px] uppercase text-black font-bold">
                      Test de Estrés Térmico y Telemetría
                    </h4>
                    <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
                      Prueba continua de 4 a 12 horas bajo carga al 100% de CPU y GPU con monitorización de caídas de voltaje de rieles de 12V y curva acústica de ventilación.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono text-[12px] font-bold shrink-0">
                    04
                  </span>
                  <div>
                    <h4 className="font-mono text-[13px] uppercase text-black font-bold">
                      Entrega Certificada y Garantía Directa
                    </h4>
                    <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
                      Emisión de reporte técnico individualizado de temperaturas pico, empaque con espuma de poliuretano in situ y sellado de garantía integral Nova Core.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#ebe8e1] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#444748] uppercase">
                DOCUMENTACIÓN: REPORTE IMPRESO INCLUIDO
              </span>
              <button
                onClick={onOpenRules}
                className="inline-flex items-center gap-1 font-mono text-[12px] uppercase text-[#0050cc] font-bold hover:underline cursor-pointer"
              >
                Solicitar Auditoría de Hardware →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: TECHNICAL COMPATIBILITY BENCHMARK WIDGET */}
      <section className="w-full px-4 md:px-12 py-14">
        <div className="bg-white p-8 border border-black shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0050cc] font-bold block">
                [SISTEMA INTELIGENTE DE COTIZACIÓN]
              </span>
              <h3 className="font-['Space_Grotesk'] text-headline-md uppercase text-black">
                ¿Tienes un presupuesto fijado?
              </h3>
              <p className="font-sans text-[13px] text-[#444748] leading-relaxed">
                Indícanos tu objetivo de uso y cifra límite. Diseñamos la arquitectura balanceando
                procesador, tarjeta gráfica y fuente sin sobrecostes innecesarios.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#0050cc]"></span>
                <span className="font-mono text-[11px] text-black uppercase font-bold">
                  Respuesta técnica en menos de 24 horas
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#ebe8e1] p-4 border border-black">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3 border border-[#c4c7c7]">
                  <span className="font-mono text-[10px] text-[#747878] uppercase block">
                    TIPO DE CARGA
                  </span>
                  <span className="font-mono text-[14px] text-black font-bold uppercase">
                    Ingeniería / CAD
                  </span>
                </div>
                <div className="bg-white p-3 border border-[#c4c7c7]">
                  <span className="font-mono text-[10px] text-[#747878] uppercase block">
                    PRESUPUESTO EJEMPLO
                  </span>
                  <span className="font-mono text-[14px] text-black font-bold uppercase">
                    $15,000 MXN / USD EQ
                  </span>
                </div>
                <div className="bg-white p-3 border border-[#c4c7c7]">
                  <span className="font-mono text-[10px] text-[#747878] uppercase block">
                    EFICIENCIA ENERGÉTICA
                  </span>
                  <span className="font-mono text-[14px] text-[#0050cc] font-bold uppercase">
                    80 PLUS GOLD
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-[#c4c7c7]">
                <div className="space-y-0.5">
                  <span className="font-mono text-[12px] text-black font-bold uppercase">
                    Cotizador Rápido Automatizado
                  </span>
                  <p className="font-mono text-[11px] text-[#444748]">
                    Selecciona tus componentes con verificación instantánea de compatibilidad.
                  </p>
                </div>
                <button
                  onClick={onOpenQuickQuote}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-black text-white px-6 py-2.5 font-mono text-[12px] uppercase tracking-wider hover:bg-[#0050cc] transition-colors font-bold cursor-pointer whitespace-nowrap"
                >
                  Iniciar Cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: TYPOGRAPHIC RHYTHM FOOTER BANNER (SWISS PATTERN) */}
      <section className="w-full px-4 md:px-12 py-8 bg-[#fcf9f2] border-t border-black">
        <div className="flex items-center justify-between overflow-hidden opacity-30 select-none pointer-events-none py-2 font-mono text-center">
          <span className="font-['Space_Grotesk'] text-[24px] md:text-[36px] uppercase font-bold tracking-widest text-black">
            NOVA
          </span>
          <span className="font-['Space_Grotesk'] text-[24px] md:text-[36px] uppercase font-bold tracking-widest text-black">
            CORE
          </span>
          <span className="font-['Space_Grotesk'] text-[24px] md:text-[36px] uppercase font-bold tracking-widest text-black">
            HARDWARE
          </span>
          <span className="font-['Space_Grotesk'] text-[24px] md:text-[36px] uppercase font-bold tracking-widest text-black">
            ENGINEERING
          </span>
          <span className="font-['Space_Grotesk'] text-[24px] md:text-[36px] uppercase font-bold tracking-widest text-black">
            2024
          </span>
        </div>
      </section>
    </div>
  );
};
