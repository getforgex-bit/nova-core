import { ConfiguratorSlot } from '../types';
import { HARDWARE_CATALOG } from './hardware';

export const INITIAL_CONFIGURATOR_SLOTS: ConfiguratorSlot[] = [
  {
    slotNumber: '01',
    label: 'PROCESADOR (CPU)',
    category: 'cpu',
    icon: 'memory',
    component: HARDWARE_CATALOG.find((c) => c.id === 'cpu-7600x') || HARDWARE_CATALOG[0],
  },
  {
    slotNumber: '02',
    label: 'TARJETA MADRE',
    category: 'mobo',
    icon: 'developer_board',
    component: HARDWARE_CATALOG.find((c) => c.id === 'mobo-msi-b650') || HARDWARE_CATALOG[9],
  },
  {
    slotNumber: '03',
    label: 'MEMORIA RAM',
    category: 'ram',
    icon: 'straighten',
    component: HARDWARE_CATALOG.find((c) => c.id === 'ram-corsair-ddr5') || HARDWARE_CATALOG[5],
  },
  {
    slotNumber: '04',
    label: 'TARJETA DE VIDEO (GPU)',
    category: 'gpu',
    icon: 'view_in_ar',
    component: HARDWARE_CATALOG.find((c) => c.id === 'gpu-4060ti') || HARDWARE_CATALOG[3],
  },
  {
    slotNumber: '05',
    label: 'ALMACENAMIENTO NVME',
    category: 'ssd',
    icon: 'storage',
    component: HARDWARE_CATALOG.find((c) => c.id === 'ssd-kc3000') || HARDWARE_CATALOG[7],
  },
  {
    slotNumber: '06',
    label: 'SISTEMA TÉRMICO / REFRIGERACIÓN',
    category: 'thermal',
    icon: 'mode_fan',
    component: HARDWARE_CATALOG.find((c) => c.id === 'cooler-ak620') || HARDWARE_CATALOG[18],
  },
  {
    slotNumber: '07',
    label: 'SUMINISTRO ELÉCTRICO (PSU)',
    category: 'psu',
    icon: 'power',
    component: HARDWARE_CATALOG.find((c) => c.id === 'psu-evga-750w') || HARDWARE_CATALOG[11],
  },
  {
    slotNumber: '08',
    label: 'CHASIS / GABINETE',
    category: 'chassis',
    icon: 'inbox',
    component: HARDWARE_CATALOG.find((c) => c.id === 'chassis-h5flow') || HARDWARE_CATALOG[19],
  },
  {
    slotNumber: '09',
    label: 'PASTA TÉRMICA DE ALTO RENDIMIENTO',
    category: 'thermal',
    icon: 'colorize',
    component: HARDWARE_CATALOG.find((c) => c.id === 'thermal-arctic-mx4') || HARDWARE_CATALOG[16],
  },
  {
    slotNumber: '10',
    label: 'SUPERFICIE / MOUSEPAD ERGONÓMICO',
    category: 'perif',
    icon: 'crop_landscape',
    component: HARDWARE_CATALOG.find((c) => c.id === 'perif-pad-desk') || HARDWARE_CATALOG[14],
  },
  {
    slotNumber: '11',
    label: 'COMUNICACIÓN & AUDIO',
    category: 'audio',
    icon: 'headset_mic',
    component: HARDWARE_CATALOG.find((c) => c.id === 'audio-headset-aurea') || HARDWARE_CATALOG[14],
  },
  {
    slotNumber: '12',
    label: 'ADAPTADORES & CONVERTIDORES DE SEÑAL',
    category: 'adapters',
    icon: 'settings_input_hdmi',
    component: HARDWARE_CATALOG.find((c) => c.id === 'adapter-dp-hdmi') || HARDWARE_CATALOG[20],
  },
];
