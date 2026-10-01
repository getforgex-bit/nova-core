import { TechService } from '../types';

export const TECH_SERVICES: TechService[] = [
  {
    id: 'srv-01',
    code: 'SRV-01',
    title: 'MANTENIMIENTO PREVENTIVO PRO',
    description:
      'Desarmado integral, purga de micropartículas electrostáticas, cambio de pasta térmica de alto rendimiento (Thermal Grizzly Kryonaut) y lubricación de ventiladores.',
    duration: 'TIEMPO: 3 HORAS',
    price: 850,
    bullets: [
      'Limpieza con alcohol isopropílico 99%',
      'Reducción térmica típica de 8°C a 14°C',
      'Reporte de telemetría pre/post servicio',
    ],
  },
  {
    id: 'srv-02',
    code: 'SRV-02',
    title: 'UPGRADE & TRASPASO DE ARQUITECTURA',
    description:
      'Actualización de GPU, CPU o motherboard. Incluye migración de datos con clonación bit-a-bit de sistema operativo y gestión milimétrica de cables bajo estándar industrial.',
    duration: 'TIEMPO: 4 HORAS',
    price: 1200,
    bullets: [
      'Clonación NVMe sin pérdida de licencias',
      'Flasheo de BIOS seguro con doble respaldo',
      'Enrutamiento limpio de cableado frontal y dorsal',
    ],
  },
  {
    id: 'srv-03',
    code: 'SRV-03',
    title: 'DIAGNÓSTICO MICROELECTRÓNICO',
    description:
      'Pruebas con osciloscopio y cámara térmica FLIR para computadoras que no dan video, sufren pantallazos azules aleatorios o caídas de voltaje en rieles VRM/PCIe.',
    duration: 'TIEMPO: 24 HORAS',
    price: 600,
    priceNote: 'INSPECCIÓN COMPLETA',
    bullets: [
      'Mapeo de cortos en riel de 12V / 5V / 3.3V',
      'Test de estrés de módulos RAM celda a celda',
      'Dictamen técnico oficial con validez legal',
    ],
  },
];
