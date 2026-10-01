import React, { useState, useMemo, useEffect } from 'react';
import { ComponentCategory, HardwareComponent } from '../types';
import { HARDWARE_CATALOG } from '../data/hardware';
import { SwissGridLoader } from '../components/SwissGridLoader';
import { ComponentComparisonModal } from '../components/ComponentComparisonModal';

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
  const [isFiltering, setIsFiltering] = useState(false);
  const [comparedComponents, setComparedComponents] = useState<HardwareComponent[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleToggleCompare = (comp: HardwareComponent) => {
    setComparedComponents((prev) => {
      const exists = prev.some((c) => c.id === comp.id);
      if (exists) {
        return prev.filter((c) => c.id !== comp.id);
      }
      if (prev.length < 2) {
        return [...prev, comp];
      }
      // Replace the second item
      return [prev[0], comp];
    });
  };

  const handleOpenComparison = () => {
    if (comparedComponents.length === 0) {
      const cpu1 = HARDWARE_CATALOG.find((c) => c.id === 'cpu-7800x3d') || HARDWARE_CATALOG[0];
      const cpu2 = HARDWARE_CATALOG.find((c) => c.id === 'cpu-7600x') || HARDWARE_CATALOG[1];
      setComparedComponents([cpu1, cpu2]);
    } else if (comparedComponents.length === 1) {
      const first = comparedComponents[0];
      const second =
        HARDWARE_CATALOG.find((c) => c.category === first.category && c.id !== first.id) ||
        HARDWARE_CATALOG.find((c) => c.id !== first.id) ||
        first;
      setComparedComponents([first, second]);
    }
    setIsComparisonOpen(true);
  };

  // Trigger Swiss Grid Scanning animation whenever filters or search change
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 420);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, selectedBrands, maxPrice, sortBy]);

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
              <span
                className={`w-2 h-2 rounded-full ${
                  isFiltering ? 'bg-[#0050cc] animate-ping' : 'bg-[#0050cc] animate-pulse'
                } inline-block`}
              ></span>
              <span className="text-[#444748] uppercase">
                {isFiltering ? 'ESCANEANDO:' : 'RESULTADOS:'}
              </span>
              <span className="text-black font-bold">
                {isFiltering
                  ? 'CALIBRANDO MATRIZ...'
                  : `${filteredProducts.length} de ${HARDWARE_CATALOG.length}`}
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

            <button
              onClick={handleOpenComparison}
              className={`px-3 py-2 font-mono text-[11px] uppercase font-bold transition-colors cursor-pointer border border-black flex items-center gap-1.5 whitespace-nowrap ${
                comparedComponents.length > 0
                  ? 'bg-[#0050cc] text-white hover:bg-black'
                  : 'bg-white hover:bg-black hover:text-white text-black'
              }`}
              title="Abrir comparador técnico lado a lado"
            >
              <span className="material-symbols-outlined text-[16px]">
                compare_arrows
              </span>
              <span>Comparador ({comparedComponents.length}/2)</span>
            </button>
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
                <span
                  className={`font-mono text-[10px] uppercase px-1.5 py-0.5 font-bold border ${
                    isFiltering
                      ? 'bg-[#0050cc] text-white border-[#0050cc]'
                      : 'bg-[#ebe8e1] text-black border-[#c4c7c7]'
                  }`}
                >
                  {isFiltering ? '[ESCANEANDO MATRIZ]' : '[FILTRO ACTIVO]'}
                </span>
                <span className="font-mono text-[12px] text-black font-bold">
                  {isFiltering ? (
                    <span className="text-[#0050cc] animate-pulse">
                      CALIBRANDO SILICIO Y PARÁMETROS INDUSTRIALES...
                    </span>
                  ) : (
                    <>
                      {filteredProducts.length} COMPONENTES PRINCIPALES ENCONTRADOS
                      {searchQuery && (
                        <span className="text-[#0050cc] ml-1 font-mono">
                          PARA: &ldquo;{searchQuery}&rdquo;
                        </span>
                      )}
                    </>
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

                <button
                  onClick={handleOpenComparison}
                  className="font-mono text-[10px] uppercase font-bold px-2.5 py-1 bg-white hover:bg-black hover:text-white text-black border border-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Abrir comparador técnico lado a lado"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                    compare_arrows
                  </span>
                  <span>Comparar ({comparedComponents.length}/2)</span>
                </button>

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

            {/* Swiss Grid Animated Loader / Empty State / Product Matrix */}
            {isFiltering ? (
              <SwissGridLoader
                query={searchQuery}
                categoryLabel={CATEGORY_NAMES[activeCategory]}
              />
            ) : filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => {
                  const isCompared = comparedComponents.some((c) => c.id === product.id);

                  // Calculate active variant and dynamic properties
                  const activeVariantId = selectedVariants[product.id] || product.variants?.[0]?.id;
                  const activeVariant = product.variants?.find((v) => v.id === activeVariantId);

                  const effectiveImage = activeVariant?.image || product.image;
                  const effectivePrice =
                    activeVariant?.price !== undefined
                      ? activeVariant.price
                      : product.price + (activeVariant?.priceDelta || 0);
                  const effectiveSku = activeVariant?.sku || product.sku;
                  const effectiveBadgeBottomRight =
                    activeVariant?.badge || product.badgeBottomRight;
                  const effectiveName = activeVariant
                    ? `${product.name} (${activeVariant.name})`
                    : product.name;

                  const itemForBuild: HardwareComponent = {
                    ...product,
                    name: effectiveName,
                    price: effectivePrice,
                    sku: effectiveSku,
                    image: effectiveImage,
                    selectedVariantId: activeVariant?.id,
                  };

                  return (
                    <article
                      key={product.id}
                      className={`bg-white p-4 flex flex-col justify-between shadow-xs border transition-all ${
                        isCompared
                          ? 'border-[#0050cc] ring-2 ring-[#0050cc]/20 shadow-md'
                          : 'border-black hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Header Bar */}
                        <div className="flex items-center justify-between pb-1 bg-[#f6f3ec] px-2 py-1 border border-[#ebe8e1]">
                          <span className="font-mono text-[10px] uppercase font-bold text-black truncate max-w-[200px]">
                            [{effectiveSku}] • {product.brand}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCompared && (
                              <span className="font-mono text-[9px] bg-[#0050cc] text-white px-1.5 py-0.2 font-bold uppercase">
                                SELECCIONADO
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-[#0050cc] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc]"></span> EN BODEGA
                            </span>
                          </div>
                        </div>

                        {/* Image Container with Dynamic Variant Support */}
                        <div className="w-full h-48 bg-[#ebe8e1] my-3 relative overflow-hidden flex items-center justify-center border border-[#c4c7c7] group">
                          <img
                            src={effectiveImage}
                            alt={effectiveName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          {product.badgeTopLeft && (
                            <span className="absolute top-2 left-2 bg-black text-white font-mono text-[10px] px-1.5 py-0.5 uppercase font-bold shadow-xs">
                              {product.badgeTopLeft}
                            </span>
                          )}
                          {effectiveBadgeBottomRight && (
                            <span className="absolute bottom-2 right-2 bg-white/95 text-black font-mono text-[10px] px-1.5 py-0.5 border border-black font-semibold shadow-xs">
                              {effectiveBadgeBottomRight}
                            </span>
                          )}
                        </div>

                        <h2 className="font-['Space_Grotesk'] text-[18px] text-black uppercase font-bold tracking-tight">
                          {product.name}
                        </h2>
                        <p className="font-mono text-[11px] text-[#444748] font-medium mt-0.5">
                          {product.subtitle}
                        </p>

                        {/* Interactive Variant Selector Strip */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="mt-3 bg-[#f1eee7] p-2.5 border border-black space-y-2">
                            <div className="flex items-center justify-between font-mono text-[9px]">
                              <span className="font-bold text-black uppercase flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-[#0050cc] inline-block animate-pulse"></span>
                                VARIANTES DE PRODUCTO ({product.variants.length}):
                              </span>
                              <span className="text-[#0050cc] font-bold uppercase">
                                SELECCIONADO: {activeVariant?.name || 'ESTÁNDAR'}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {product.variants.map((v) => {
                                const isSelected = activeVariant?.id === v.id;
                                const deltaText = v.priceDelta
                                  ? v.priceDelta > 0
                                    ? `+$${v.priceDelta.toLocaleString('es-MX')}`
                                    : `-$${Math.abs(v.priceDelta).toLocaleString('es-MX')}`
                                  : v.price && v.price !== product.price
                                  ? `$${v.price.toLocaleString('es-MX')}`
                                  : '';

                                return (
                                  <button
                                    key={v.id}
                                    type="button"
                                    onClick={() =>
                                      setSelectedVariants((prev) => ({
                                        ...prev,
                                        [product.id]: v.id,
                                      }))
                                    }
                                    className={`font-mono text-[10px] px-2 py-1 uppercase tracking-tight border transition-all cursor-pointer flex items-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-black text-white border-black font-bold shadow-[2px_2px_0px_0px_#0050cc]'
                                        : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black hover:text-black'
                                    }`}
                                    title={`Seleccionar variante: ${v.name}`}
                                  >
                                    {isSelected ? (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc] shrink-0"></span>
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#c4c7c7] shrink-0"></span>
                                    )}
                                    <span className="truncate max-w-[130px] sm:max-w-[180px]">{v.name}</span>
                                    {deltaText && (
                                      <span
                                        className={`text-[9px] font-bold shrink-0 ${
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
                          </div>
                        )}

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
                            ${effectivePrice.toLocaleString('es-MX')} MXN
                          </span>
                        </div>

                        {/* Compare Selection Button */}
                        <button
                          onClick={() => handleToggleCompare(itemForBuild)}
                          className={`w-full font-mono text-[10px] uppercase py-1.5 font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border ${
                            isCompared
                              ? 'bg-[#0050cc] text-white border-[#0050cc]'
                              : 'bg-white text-black hover:bg-[#f6f3ec] border-black'
                          }`}
                          title={
                            isCompared
                              ? 'Remover del comparador técnico'
                              : 'Seleccionar para comparar especificaciones lado a lado'
                          }
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isCompared ? 'check_circle' : 'compare_arrows'}
                          </span>
                          <span>
                            {isCompared ? '✓ Seleccionado en Comparador' : 'Comparar Especificaciones'}
                          </span>
                        </button>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() =>
                              onAddToCart(
                                effectiveName,
                                effectivePrice,
                                effectiveSku,
                                effectiveImage,
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
                            onClick={() => onUseInBuild(itemForBuild)}
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
                  );
                })}
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

      {/* Floating Comparison Dock */}
      {comparedComponents.length > 0 && (
        <aside
          aria-label="Bandeja de comparación de componentes"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-black text-white p-3 border-2 border-black shadow-[6px_6px_0px_0px_#0050cc] flex flex-col md:flex-row items-center justify-between gap-3 animate-fadeIn"
        >
          {/* Left slots overview */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 bg-[#0050cc] inline-block"></span>
              <span className="font-mono text-[9px] uppercase font-bold text-[#b3c5ff] tracking-wider">
                COMPARADOR [{comparedComponents.length}/2]:
              </span>
            </div>

            {/* Component A Slot */}
            <div className="flex items-center gap-2 bg-[#1c1b1f] border border-white/20 px-2 py-1 shrink-0 max-w-[210px] sm:max-w-[250px]">
              <img
                src={comparedComponents[0].image}
                alt={comparedComponents[0].name}
                className="w-7 h-7 object-cover bg-white shrink-0 border border-white/30"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-white font-bold truncate">
                  {comparedComponents[0].name}
                </p>
                <p className="font-mono text-[9px] text-[#747878] truncate">
                  [{comparedComponents[0].sku}] • ${comparedComponents[0].price.toLocaleString('es-MX')}
                </p>
              </div>
              <button
                onClick={() => handleToggleCompare(comparedComponents[0])}
                className="text-[#747878] hover:text-white ml-1 cursor-pointer p-0.5"
                title="Quitar de la comparación"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>

            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#0050cc] shrink-0">
              VS
            </span>

            {/* Component B Slot */}
            {comparedComponents.length > 1 ? (
              <div className="flex items-center gap-2 bg-[#1c1b1f] border border-white/20 px-2 py-1 shrink-0 max-w-[210px] sm:max-w-[250px]">
                <img
                  src={comparedComponents[1].image}
                  alt={comparedComponents[1].name}
                  className="w-7 h-7 object-cover bg-white shrink-0 border border-white/30"
                />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-white font-bold truncate">
                    {comparedComponents[1].name}
                  </p>
                  <p className="font-mono text-[9px] text-[#747878] truncate">
                    [{comparedComponents[1].sku}] • ${comparedComponents[1].price.toLocaleString('es-MX')}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleCompare(comparedComponents[1])}
                  className="text-[#747878] hover:text-white ml-1 cursor-pointer p-0.5"
                  title="Quitar de la comparación"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-white/40 px-3 py-1 font-mono text-[10px] text-[#b3c5ff] shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>Selecciona otro componente</span>
              </div>
            )}
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => setComparedComponents([])}
              className="font-mono text-[10px] text-[#747878] hover:text-white uppercase underline cursor-pointer px-2"
            >
              Limpiar
            </button>
            <button
              onClick={handleOpenComparison}
              className="bg-[#0050cc] hover:bg-white hover:text-black text-white font-mono text-[11px] uppercase font-bold px-4 py-2 flex items-center gap-1.5 transition-colors cursor-pointer border border-[#0050cc] hover:border-white shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>
                {comparedComponents.length === 2
                  ? 'Abrir Comparador Lado a Lado'
                  : 'Comparar (Auto-completar)'}
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* Side-by-Side Component Comparison Modal */}
      {isComparisonOpen && (
        <ComponentComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          componentA={comparedComponents[0] || HARDWARE_CATALOG[0]}
          componentB={comparedComponents[1] || HARDWARE_CATALOG[1]}
          onSelectComponentA={(comp) => {
            setComparedComponents((prev) => [comp, prev[1] || HARDWARE_CATALOG[1]]);
          }}
          onSelectComponentB={(comp) => {
            setComparedComponents((prev) => [prev[0] || HARDWARE_CATALOG[0], comp]);
          }}
          onAddToCart={onAddToCart}
          onUseInBuild={onUseInBuild}
        />
      )}
    </div>
  );
};
