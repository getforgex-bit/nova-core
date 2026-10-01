import React, { useState, useMemo } from 'react';
import { ComponentCategory, HardwareComponent } from '../types';
import { HARDWARE_CATALOG } from '../data/hardware';

interface CatalogViewProps {
  onAddToCart: (name: string, price: number, sku?: string, image?: string, category?: string) => void;
  onUseInBuild: (component: HardwareComponent) => void;
  onOpenRules: () => void;
}

// Category human labels dictionary
const CATEGORY_NAMES: Record<ComponentCategory, string> = {
  all: 'Todos los Componentes',
  cpu: 'Procesadores (CPU)',
  gpu: 'Tarjetas Gráficas (GPU)',
  ram: 'Memorias RAM DDR5',
  ssd: 'Almacenamiento SSD M.2 NVMe',
  mobo: 'Tarjetas Madre (Motherboards)',
  psu: 'Fuentes de Poder ATX 3.0',
  perif: 'Periféricos & Monitores',
  audio: 'Audio de Estudio & Micrófonos',
  adapters: 'Conectividad & Adaptadores',
  thermal: 'Refrigeración & Compuestos Térmicos',
  chassis: 'Chasis & Gabinetes',
};

// Technical category synonyms to allow searches like "procesador", "gráfica", "placa", "memoria", "fuente", "audio", etc.
const CATEGORY_SYNONYMS: Record<ComponentCategory, string[]> = {
  all: ['todos', 'todo', 'all'],
  cpu: ['cpu', 'procesador', 'procesadores', 'microprocesador', 'ryzen', 'intel', 'core', 'am5', 'lga1700', 'zen', 'zen4', 'zen5', 'socket'],
  gpu: ['gpu', 'grafica', 'gráfica', 'graficas', 'gráficas', 'video', 'tarjeta de video', 'rtx', 'geforce', 'radeon', 'cuda', 'dlss'],
  ram: ['ram', 'memoria', 'memorias', 'ddr5', 'ddr4', 'kingston', 'fury', 'corsair', 'vengeance', 'expo', 'xmp', 'cl30', 'cl36'],
  ssd: ['ssd', 'almacenamiento', 'nvme', 'm.2', 'disco', 'samsung', 'kc3000', '990 pro', 'solido', 'sólido', 'pcie'],
  mobo: ['mobo', 'motherboard', 'tarjeta madre', 'placa', 'placa madre', 'chipset', 'b650', 'am5', 'tuf', 'msi', 'asus'],
  psu: ['psu', 'fuente', 'fuentes', 'poder', 'modular', 'gold', 'watts', '850w', '750w', 'corsair', 'evga', 'atx 3.0', '12vhpwr'],
  perif: ['perif', 'periferico', 'periféricos', 'monitor', 'pantalla', 'ips', '180hz', 'teclado', 'mecanico', 'mecánico', 'mousepad', 'tapete', 'webcam', 'camara', 'cámara'],
  audio: ['audio', 'sonido', 'microfono', 'micrófono', 'auriculares', 'audifonos', 'audífonos', 'bocina', 'estudio', 'par estéreo', 'over-ear', 'xlr', 'cardioide', 'aura'],
  adapters: ['adapters', 'adaptador', 'adaptadores', 'hub', 'usbc', 'usb-c', 'hdmi', 'displayport', 'conector', 'cable', 'thunderbolt'],
  thermal: ['thermal', 'termico', 'térmico', 'pasta', 'pasta termica', 'pasta térmica', 'liquid metal', 'metal liquido', 'metal líquido', 'refrigeracion', 'refrigeración', 'cooler', 'disipador', 'arctic', 'mx-4', 'ak620'],
  chassis: ['chasis', 'chassis', 'gabinete', 'caja', 'nzxt', 'h5', 'flow', 'tower'],
};

// Clean string for accent-insensitive search
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const CatalogView: React.FC<CatalogViewProps> = ({
  onAddToCart,
  onUseInBuild,
  onOpenRules,
}) => {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([
    'AMD',
    'Intel',
    'NVIDIA',
    'ASUS',
    'MSI',
    'Kingston',
    'Corsair',
    'Logitech',
  ]);
  const [maxPrice, setMaxPrice] = useState(45000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  const categories: { key: ComponentCategory; label: string }[] = [
    { key: 'all', label: '[00] TODOS' },
    { key: 'cpu', label: '[01] PROCESADORES (CPU)' },
    { key: 'gpu', label: '[02] GRÁFICAS (GPU)' },
    { key: 'ram', label: '[03] MEMORIAS RAM' },
    { key: 'ssd', label: '[04] ALMACENAMIENTO SSD' },
    { key: 'mobo', label: '[05] MOTHERBOARDS' },
    { key: 'psu', label: '[06] FUENTES DE PODER' },
    { key: 'perif', label: '[07] PERIFÉRICOS' },
    { key: 'audio', label: '[08] AUDIO Y MICRÓFONOS' },
    { key: 'adapters', label: '[09] CONECTIVIDAD Y ADAPTADORES' },
    { key: 'thermal', label: '[10] REFRIGERACIÓN Y TÉRMICO' },
  ];

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedBrands(['AMD', 'Intel', 'NVIDIA', 'ASUS', 'MSI', 'Kingston', 'Corsair', 'Logitech']);
    setMaxPrice(45000);
    setSortBy('relevance');
  };

  // Real-time search & filter engine
  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery.trim());

    return HARDWARE_CATALOG.filter((item) => {
      // 1. Direct Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 2. Price filter
      if (item.price > maxPrice) {
        return false;
      }

      // 3. Brand filter
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some(
          (b) => b.toLowerCase() === item.brand.toLowerCase()
        );
        const isCoreBrand = ['amd', 'intel', 'nvidia', 'asus', 'msi', 'kingston', 'corsair', 'logitech'].includes(
          item.brand.toLowerCase()
        );
        if (isCoreBrand && !brandMatch) {
          return false;
        }
      }

      // 4. Real-time Search Query matching name, category, SKU, brand, subtitle & technical specs
      if (query) {
        const normalizedName = normalizeText(item.name);
        const normalizedSku = normalizeText(item.sku);
        const normalizedBrand = normalizeText(item.brand);
        const normalizedSubtitle = normalizeText(item.subtitle);
        const normalizedCategoryName = normalizeText(CATEGORY_NAMES[item.category] || '');

        // Check if query matches category synonyms (e.g. typing "procesador", "grafica", "ram", "audio")
        const synonyms = CATEGORY_SYNONYMS[item.category] || [];
        const matchesCategorySynonym = synonyms.some((syn) => normalizeText(syn).includes(query) || query.includes(normalizeText(syn)));

        // Check specs
        const matchesSpecs = item.specs.some((spec) => {
          return (
            normalizeText(spec.label).includes(query) ||
            normalizeText(spec.value).includes(query)
          );
        });

        const matchesBadges =
          (item.badgeTopLeft && normalizeText(item.badgeTopLeft).includes(query)) ||
          (item.badgeBottomRight && normalizeText(item.badgeBottomRight).includes(query));

        const matchesBasic =
          normalizedName.includes(query) ||
          normalizedSku.includes(query) ||
          normalizedBrand.includes(query) ||
          normalizedSubtitle.includes(query) ||
          normalizedCategoryName.includes(query);

        if (!matchesBasic && !matchesCategorySynonym && !matchesSpecs && !matchesBadges) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [activeCategory, maxPrice, searchQuery, selectedBrands, sortBy]);

  return (
    <div className="flex flex-col w-full">
      {/* Sub-header / System Status Ribbon */}
      <section className="w-full bg-[#ebe8e1] px-4 md:px-12 py-2 flex flex-wrap items-center justify-between gap-2 text-[#1c1c18] border-b border-black">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#444748] flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0050cc] inline-block animate-pulse"></span>
            CATÁLOGO DE HARDWARE PRECISO • MATRIX V.4.2
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#747878]">|</span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#444748] uppercase">
            ALIANZA OFICIAL: GRUPO CVA / INTCOMEX CERTIFIED
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span className="text-[#444748]">
            DISPONIBILIDAD INVENTARIO:{' '}
            <strong className="text-black font-bold">98.4% STOCK ACTIVO</strong>
          </span>
          <span className="text-[#747878]">/</span>
          <span className="text-[#0050cc] font-bold">LATAM CENTRAL HUB</span>
        </div>
      </section>

      {/* Editorial Title & Manifest Header */}
      <section className="w-full px-4 md:px-12 pt-8 pb-4 bg-[#fcf9f2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] uppercase tracking-wider bg-black text-white px-1.5 py-0.5 font-bold">
                [MAT-02]
              </span>
              <span className="font-mono text-[12px] uppercase tracking-wider text-[#444748] font-bold">
                ÍNDICE DE SUMINISTRO & COMPONENTES RAW
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-headline-xl text-black uppercase tracking-tighter leading-none m-0">
              CATÁLOGO HARDWARE
            </h1>
            <p className="font-sans text-[14px] text-[#444748] max-w-2xl pt-1">
              Arquitectura de microchips de alto rendimiento, aceleración gráfica y módulos de memoria
              validados bajo estándares industriales. Distribución directa autorizada sin
              intermediarios redundantes.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between self-stretch pt-2 lg:pt-0">
            <div className="bg-[#f1eee7] p-3 w-full lg:w-auto text-left lg:text-right border border-black shadow-xs">
              <div className="font-mono text-[10px] uppercase text-[#747878] font-bold">
                ÍNDICE DE COMPONENTES
              </div>
              <div className="font-['Space_Grotesk'] text-[20px] text-black tracking-tight font-bold">
                428 UNIDADES ACTIVAS
              </div>
              <div className="font-mono text-[10px] text-[#0050cc] font-bold mt-0.5">
                COMPATIBILIDAD ATX 3.0 / PCIe 5.0
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#444748] font-mono text-[10px] mt-2">
              <span>PARÁMETROS MONITOREADOS EN TIEMPO REAL</span>
              <span className="material-symbols-outlined text-[16px] text-[#0050cc]">tune</span>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMALIST REAL-TIME SEARCH BAR (HERO COMPONENT) */}
      <section className="w-full px-4 md:px-12 py-3 bg-[#f6f3ec] border-y border-black">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#0050cc] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="BUSCAR POR NOMBRE O CATEGORÍA TÉCNICA (EJ. RYZEN, GPU, DDR5, NVME, AUDIO, FUENTE)..."
              className="w-full bg-white border border-black pl-11 pr-24 py-2.5 font-mono text-[12px] uppercase text-black placeholder:text-[#747878] placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-black shadow-xs tracking-wider"
              aria-label="Buscar componentes en tiempo real"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 px-2 py-1 font-mono text-[10px] uppercase font-bold text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#ffdad6] cursor-pointer"
                title="Limpiar búsqueda"
              >
                [✕ BORRAR]
              </button>
            )}
          </div>

          {/* Search Telemetry & Quick Action */}
          <div className="flex items-center gap-2 justify-between md:justify-end shrink-0">
            <div className="bg-[#ebe8e1] px-3 py-2 border border-black font-mono text-[11px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0050cc] inline-block animate-pulse"></span>
              <span className="text-[#444748] uppercase">RESULTADOS:</span>
              <span className="text-black font-bold">
                {filteredProducts.length} de {HARDWARE_CATALOG.length}
              </span>
            </div>

            {searchQuery && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-black text-white font-mono text-[11px] uppercase font-bold hover:bg-[#0050cc] transition-colors cursor-pointer border border-black whitespace-nowrap"
              >
                Restablecer
              </button>
            )}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 scrollbar-none font-mono text-[10px]">
          <span className="text-[#747878] uppercase shrink-0 font-bold mr-1">
            FILTROS TÉCNICOS RÁPIDOS:
          </span>
          {[
            { label: 'AMD RYZEN', query: 'ryzen' },
            { label: 'NVIDIA RTX', query: 'rtx' },
            { label: 'DDR5 6000MHz', query: 'ddr5' },
            { label: 'NVMe Gen4', query: 'nvme' },
            { label: 'Placas AM5', query: 'b650' },
            { label: 'Fuentes ATX 3.0', query: 'fuente' },
            { label: 'Audio Estudio', query: 'audio' },
            { label: 'Pasta Térmica', query: 'pasta' },
          ].map((chip) => (
            <button
              key={chip.query}
              onClick={() => setSearchQuery(chip.query)}
              className={`px-2 py-0.5 uppercase border cursor-pointer transition-colors whitespace-nowrap ${
                searchQuery.toLowerCase() === chip.query
                  ? 'bg-[#0050cc] text-white border-[#0050cc] font-bold'
                  : 'bg-white text-black hover:bg-[#ebe8e1] border-[#c4c7c7]'
              }`}
            >
              +{chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* Category Primary Filter Bar (Sticky Horizontal Scroll) */}
      <section className="w-full px-4 md:px-12 py-2 bg-[#f1eee7] border-b border-black sticky top-16 z-40">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`font-mono text-[12px] uppercase px-4 py-2 tracking-wider whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-black text-white font-bold border-black'
                    : 'bg-white text-black hover:bg-[#ebe8e1] font-medium border-[#c4c7c7]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Body: Technical Filter Sidebar & Modular Product Matrix */}
      <section className="w-full px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Swiss Technical Filter Matrix */}
          <aside className="lg:col-span-3 flex flex-col space-y-4">
            {/* Filter Header Box */}
            <div className="bg-black text-white p-3 flex items-center justify-between border border-black">
              <div className="flex items-center gap-1.5 font-mono text-[12px] uppercase font-bold tracking-wider">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>FILTROS TÉCNICOS</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="font-mono text-[10px] uppercase underline text-[#dae1ff] hover:text-white cursor-pointer"
              >
                LIMPIAR
              </button>
            </div>

            {/* Sidebar Search Input (Synchronized) */}
            <div className="bg-white p-3 flex flex-col space-y-1.5 shadow-xs border border-black">
              <label
                htmlFor="componentSearch"
                className="font-mono text-[10px] uppercase text-[#444748] font-bold"
              >
                BÚSQUEDA POR MODELO / SKU
              </label>
              <div className="relative flex items-center">
                <input
                  id="componentSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ej. 7800X3D, RTX, DDR5..."
                  className="w-full bg-[#f6f3ec] px-3 py-1.5 font-sans text-[13px] text-black focus:outline-none focus:bg-white border border-[#c4c7c7] focus:border-black placeholder:text-[#747878]"
                />
                <span className="material-symbols-outlined absolute right-2 text-[#444748] text-[18px] pointer-events-none">
                  search
                </span>
              </div>
            </div>

            {/* Brands Selector */}
            <div className="bg-white p-4 flex flex-col space-y-2 shadow-xs border border-black">
              <div className="flex items-center justify-between pb-1 bg-[#f6f3ec] px-2 py-1 border border-[#ebe8e1]">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-black">
                  FABRICANTE OEM
                </span>
                <span className="font-mono text-[10px] text-[#747878]">[08 MARCAS]</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                {['AMD', 'Intel', 'NVIDIA', 'ASUS', 'MSI', 'Kingston', 'Corsair', 'Logitech'].map(
                  (brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-1.5 text-black cursor-pointer hover:text-[#0050cc]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-3.5 h-3.5 accent-black cursor-pointer"
                      />
                      <span>{brand}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Socket & Platform Specs */}
            <div className="bg-white p-4 flex flex-col space-y-2 shadow-xs border border-black">
              <div className="flex items-center justify-between pb-1 bg-[#f6f3ec] px-2 py-1 border border-[#ebe8e1]">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-black">
                  SOCKET & PLATAFORMA
                </span>
                <span className="font-mono text-[10px] text-[#747878]">[INTERFAZ]</span>
              </div>
              <div className="flex flex-col space-y-1.5 font-mono text-[10px] pt-1">
                <label className="flex items-center justify-between text-[#444748] hover:text-black cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-black" />
                    <span>AM5 (AMD Zen 4/5)</span>
                  </span>
                  <span className="text-[#747878]">[14]</span>
                </label>
                <label className="flex items-center justify-between text-[#444748] hover:text-black cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-black" />
                    <span>LGA 1700 (Intel 13/14 Gen)</span>
                  </span>
                  <span className="text-[#747878]">[12]</span>
                </label>
                <label className="flex items-center justify-between text-[#444748] hover:text-black cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-black" />
                    <span>PCIe 4.0 / PCIe 5.0</span>
                  </span>
                  <span className="text-[#747878]">[38]</span>
                </label>
                <label className="flex items-center justify-between text-[#444748] hover:text-black cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-black" />
                    <span>DDR5 5600MHz - 7200MHz</span>
                  </span>
                  <span className="text-[#747878]">[22]</span>
                </label>
              </div>
            </div>

            {/* Range Slider: Price */}
            <div className="bg-white p-4 flex flex-col space-y-2 shadow-xs border border-black">
              <div className="flex items-center justify-between pb-1 bg-[#f6f3ec] px-2 py-1 border border-[#ebe8e1]">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-black">
                  RANGO DE PRESUPUESTO
                </span>
                <span className="font-mono text-[10px] text-[#0050cc] font-bold">MXN</span>
              </div>
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between font-mono text-[12px] text-black font-bold">
                  <span>$1,200 MXN</span>
                  <span>${maxPrice.toLocaleString('es-MX')} MXN</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="45000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-[#747878]">
                  <span>Base / Entry</span>
                  <span>Workstation Pro</span>
                </div>
              </div>
            </div>

            {/* Wholesale Verification Banner */}
            <div className="bg-[#f1eee7] p-4 flex flex-col space-y-1.5 border border-black">
              <div className="flex items-center gap-1.5 text-black font-mono text-[10px] font-bold uppercase">
                <span className="material-symbols-outlined text-[16px] text-[#0050cc]">
                  verified_user
                </span>
                <span>GARANTÍA DIRECTA DISTRIBUIDOR</span>
              </div>
              <p className="font-sans text-[12px] text-[#444748] leading-relaxed">
                Componentes provistos con trazabilidad de serie OEM a través de redes logísticas
                mexicanas oficiales (Grupo CVA & Intcomex).
              </p>
              <div className="pt-1 font-mono text-[10px] text-[#0050cc] font-bold uppercase">
                • FACTURACIÓN CFDI 4.0 INMEDIATA
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT MATRIX: 9 Columns */}
          <main className="lg:col-span-9 flex flex-col space-y-4">
            {/* Result Controls Ribbon */}
            <div className="bg-white p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs border border-black">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase bg-[#ebe8e1] text-black px-1.5 py-0.5 font-bold border border-[#c4c7c7]">
                  [FILTRO ACTIVO]
                </span>
                <span className="font-mono text-[12px] text-black font-bold">
                  {filteredProducts.length} COMPONENTES PRINCIPALES ENCONTRADOS
                  {searchQuery && (
                    <span className="text-[#0050cc] ml-1 font-mono">
                      PARA: &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#444748]">
                  <span>ORDENAR:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Criterio de ordenamiento del catálogo"
                    className="bg-[#f6f3ec] px-2 py-1 text-black font-mono text-[10px] font-bold focus:outline-none border border-[#c4c7c7] cursor-pointer"
                  >
                    <option value="relevance">RELEVANCIA INDUSTRIAL</option>
                    <option value="price-asc">PRECIO: MENOR A MAYOR</option>
                    <option value="price-desc">PRECIO: MAYOR A MENOR</option>
                  </select>
                </div>

                <div className="hidden md:flex items-center gap-1 bg-[#f6f3ec] p-0.5 border border-[#c4c7c7]">
                  <button className="p-1 bg-white text-black border border-[#c4c7c7]" title="Vista de Grilla">
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  </button>
                  <button className="p-1 text-[#444748] hover:text-black" title="Vista de Lista Técnica">
                    <span className="material-symbols-outlined text-[16px]">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Hardware Compatibility Widget */}
            <div className="bg-[#f1eee7] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">fact_check</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      MATRIZ DE COMPATIBILIDAD DINÁMICA
                    </span>
                    <span className="font-mono text-[9px] text-[#0050cc] bg-white px-1 font-bold border border-[#c4c7c7]">
                      ACTIVA
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-[#444748]">
                    Seleccione procesador y tarjeta madre para validar automáticamente líneas PCIe,
                    generación DDR y consumo de potencia (Watts).
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRules}
                className="font-mono text-[10px] uppercase tracking-wider bg-white text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors shrink-0 font-bold cursor-pointer whitespace-nowrap"
              >
                VER REGLAS TÉCNICAS
              </button>
            </div>

            {/* Empty State when no results match */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center border border-black space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-[#f1eee7] border border-black mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px] text-[#747878]">
                    search_off
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-['Space_Grotesk'] text-[20px] uppercase text-black font-bold">
                    No se encontraron componentes
                  </h3>
                  <p className="font-mono text-[12px] text-[#444748]">
                    Ningún componente coincide con el criterio: &ldquo;{searchQuery}&rdquo; en la
                    categoría seleccionada.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-black text-white font-mono text-[12px] uppercase font-bold hover:bg-[#0050cc] transition-colors cursor-pointer border border-black"
                  >
                    Restablecer Filtros y Búsqueda
                  </button>
                </div>
              </div>
            ) : (
              /* Product Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="bg-white p-4 flex flex-col justify-between shadow-xs border border-black hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Header Bar */}
                      <div className="flex items-center justify-between pb-1 bg-[#f6f3ec] px-2 py-1 border border-[#ebe8e1]">
                        <span className="font-mono text-[10px] uppercase font-bold text-black">
                          [{product.sku}] • {product.brand}
                        </span>
                        <span className="font-mono text-[10px] text-[#0050cc] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc]"></span> EN BODEGA -
                          ENVÍO INMEDIATO
                        </span>
                      </div>

                      {/* Image Container */}
                      <div className="w-full h-48 bg-[#ebe8e1] my-3 relative overflow-hidden flex items-center justify-center border border-[#c4c7c7]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {product.badgeTopLeft && (
                          <span className="absolute top-2 left-2 bg-black text-white font-mono text-[10px] px-1.5 py-0.5 uppercase font-bold">
                            {product.badgeTopLeft}
                          </span>
                        )}
                        {product.badgeBottomRight && (
                          <span className="absolute bottom-2 right-2 bg-white/95 text-black font-mono text-[10px] px-1.5 py-0.5 border border-black font-semibold">
                            {product.badgeBottomRight}
                          </span>
                        )}
                      </div>

                      <h2 className="font-['Space_Grotesk'] text-[18px] text-black uppercase font-bold tracking-tight">
                        {product.name}
                      </h2>
                      <p className="font-mono text-[11px] text-[#444748] font-medium mt-0.5">
                        {product.subtitle}
                      </p>

                      {/* Specs Box */}
                      <div className="mt-3 bg-[#f6f3ec] p-2 flex flex-col space-y-1 font-mono text-[10px] border border-[#ebe8e1]">
                        {product.specs.map((spec, idx) => (
                          <div key={idx} className="flex justify-between text-[#444748]">
                            <span>{spec.label}</span>
                            <span className="font-bold text-black truncate ml-2">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing and Actions */}
                    <div className="mt-4 pt-2 border-t border-[#ebe8e1] flex flex-col space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-[10px] uppercase text-[#747878]">
                          PRECIO UNITARIO NETO
                        </span>
                        <span className="font-['Space_Grotesk'] text-[20px] text-black font-bold tracking-tight">
                          ${product.price.toLocaleString('es-MX')} MXN
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() =>
                            onAddToCart(
                              product.name,
                              product.price,
                              product.sku,
                              product.image,
                              product.category
                            )
                          }
                          className="bg-black text-white hover:bg-[#0050cc] font-mono text-[11px] uppercase py-2 font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-black"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add_shopping_cart
                          </span>
                          <span>Añadir</span>
                        </button>
                        <button
                          onClick={() => onUseInBuild(product)}
                          className="bg-[#f6f3ec] text-black hover:bg-black hover:text-white font-mono text-[11px] uppercase py-2 font-bold tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-black"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            precision_manufacturing
                          </span>
                          <span>Ensamble</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination & Matrix Telemetry Footer */}
            {filteredProducts.length > 0 && (
              <div className="bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs border border-black">
                <div className="flex items-center gap-1 font-mono text-[10px] text-[#444748]">
                  <span>MOSTRANDO</span>
                  <span className="text-black font-bold">1 - {filteredProducts.length}</span>
                  <span>DE 428 SKUs VALIDADOS BAJO ESTÁNDAR NOVA CORE</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <button className="px-3 py-1 bg-black text-white font-bold cursor-pointer">
                    1
                  </button>
                  <button className="px-3 py-1 bg-[#f1eee7] hover:bg-[#ebe8e1] text-black cursor-pointer border border-[#c4c7c7]">
                    2
                  </button>
                  <button className="px-3 py-1 bg-[#f1eee7] hover:bg-[#ebe8e1] text-black cursor-pointer border border-[#c4c7c7]">
                    3
                  </button>
                  <span className="px-1 text-[#747878]">…</span>
                  <button className="px-3 py-1 bg-[#f1eee7] hover:bg-[#ebe8e1] text-black cursor-pointer border border-[#c4c7c7]">
                    18
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};
