export type ComponentCategory =
  | 'all'
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'ssd'
  | 'mobo'
  | 'psu'
  | 'perif'
  | 'audio'
  | 'adapters'
  | 'thermal'
  | 'chassis';

export interface ComponentSpec {
  label: string;
  value: string;
}

export interface ComponentVariant {
  id: string;
  name: string;
  sku: string;
  priceDelta?: number; // relative price adjustment compared to base component
  price?: number; // absolute price override if provided
  image?: string;
  badge?: string;
  specsDelta?: ComponentSpec[];
  tdpDelta?: number;
}

export interface HardwareComponent {
  id: string;
  sku: string;
  brand: string;
  category: ComponentCategory;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  badgeTopLeft?: string;
  badgeBottomRight?: string;
  tdpWattage?: number;
  socket?: string;
  chipset?: string;
  supportedChipsets?: string[];
  specs: ComponentSpec[];
  stockTag?: string;
  variants?: ComponentVariant[];
  selectedVariantId?: string;
}

export interface PackVariant {
  id: string;
  name: string;
  priceDelta?: number;
  price?: number;
  image?: string;
  chassisTag?: string;
  specsHighlight?: string;
}

export interface PrebuiltPack {
  id: string;
  ref: string;
  series: string;
  category: 'oficina' | 'gaming' | 'workstation' | 'ultra';
  name: string;
  idealText: string;
  price: number;
  monthlyNote: string;
  image: string;
  chassisTag: string;
  stockCount: number;
  benchmarkTitle: string;
  benchmarkIndex: string;
  metrics: {
    label: string;
    value: string;
    progress: number;
    highlight?: boolean;
  }[];
  components: {
    label: string;
    value: string;
  }[];
  warrantyText: string;
  extraTag: string;
  headerStyle?: 'default' | 'accent' | 'dark';
  variants?: PackVariant[];
  selectedVariantId?: string;
}

export interface TechService {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  priceNote?: string;
  bullets: string[];
}

export interface ConfiguratorSlot {
  slotNumber: string;
  label: string;
  category: ComponentCategory;
  icon: string;
  component: HardwareComponent;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
  image?: string;
  category?: string;
}

export type ActiveView =
  | 'inicio-presentacion'
  | 'catalogo-de-componentes'
  | 'ensamblaje-a-medida'
  | 'packs-predeterminados'
  | 'servicios-tecnicos';
