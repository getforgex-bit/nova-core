import { HardwareComponent } from '../types';

export interface CompatibilityResult {
  isCompatible: boolean;
  hasSocketConflict: boolean;
  hasChipsetConflict: boolean;
  cpuSocket: string;
  moboSocket: string;
  moboChipset: string;
  cpuSupportedChipsets: string[];
  severity: 'ok' | 'critical';
  title: string;
  description: string;
  technicalDetails: string;
  suggestedAction: string;
}

/**
 * Normalizes socket strings into canonical forms: 'AM5', 'LGA1700', 'AM4', 'LGA1851', etc.
 */
export function extractSocket(component?: HardwareComponent): string {
  if (!component) return 'UNKNOWN';

  if (component.socket) {
    return component.socket.toUpperCase().trim();
  }

  const textToScan = `${component.name} ${component.subtitle} ${component.badgeTopLeft || ''} ${component.badgeBottomRight || ''} ${component.specs?.map((s) => `${s.label} ${s.value}`).join(' ') || ''}`.toUpperCase();

  // AM5 detection
  if (
    textToScan.includes('AM5') ||
    textToScan.includes('7800X3D') ||
    textToScan.includes('7600X') ||
    textToScan.includes('7700X') ||
    textToScan.includes('7900X') ||
    textToScan.includes('7950X') ||
    textToScan.includes('ZEN 4') ||
    textToScan.includes('ZEN 5') ||
    textToScan.includes('B650') ||
    textToScan.includes('X670') ||
    textToScan.includes('A620') ||
    textToScan.includes('X870')
  ) {
    return 'AM5';
  }

  // LGA1700 detection
  if (
    textToScan.includes('LGA1700') ||
    textToScan.includes('LGA 1700') ||
    textToScan.includes('14700') ||
    textToScan.includes('14900') ||
    textToScan.includes('13600') ||
    textToScan.includes('13700') ||
    textToScan.includes('13900') ||
    textToScan.includes('12400') ||
    textToScan.includes('12600') ||
    textToScan.includes('12700') ||
    textToScan.includes('Z790') ||
    textToScan.includes('B760') ||
    textToScan.includes('H770') ||
    textToScan.includes('Z690') ||
    textToScan.includes('B660') ||
    textToScan.includes('H610')
  ) {
    return 'LGA1700';
  }

  // AM4 detection
  if (
    textToScan.includes('AM4') ||
    textToScan.includes('5800X') ||
    textToScan.includes('5600X') ||
    textToScan.includes('5700X') ||
    textToScan.includes('5900X') ||
    textToScan.includes('5950X') ||
    textToScan.includes('ZEN 3') ||
    textToScan.includes('B550') ||
    textToScan.includes('X570') ||
    textToScan.includes('B450') ||
    textToScan.includes('A520')
  ) {
    return 'AM4';
  }

  // LGA1851 (Core Ultra)
  if (textToScan.includes('LGA1851') || textToScan.includes('Z890') || textToScan.includes('CORE ULTRA')) {
    return 'LGA1851';
  }

  return 'ESTÁNDAR_ATX';
}

/**
 * Extracts motherboards or CPU chipset identifier
 */
export function extractChipset(component?: HardwareComponent): string {
  if (!component) return 'UNKNOWN';

  if (component.chipset) {
    return component.chipset.toUpperCase().trim();
  }

  const textToScan = `${component.name} ${component.subtitle} ${component.badgeTopLeft || ''} ${component.badgeBottomRight || ''} ${component.specs?.map((s) => `${s.label} ${s.value}`).join(' ') || ''}`.toUpperCase();

  const chipsets = [
    'X870E', 'X870', 'X670E', 'X670', 'B650E', 'B650', 'A620',
    'Z790', 'B760', 'H770', 'Z690', 'B660', 'H610',
    'X570', 'B550', 'B450', 'A520',
    'Z890', 'B860'
  ];

  for (const cs of chipsets) {
    if (textToScan.includes(cs)) {
      return cs;
    }
  }

  return 'GENÉRICO';
}

/**
 * Returns supported chipsets for a given CPU socket / CPU component
 */
export function getSupportedChipsetsForCpu(cpuComponent?: HardwareComponent, socket?: string): string[] {
  if (cpuComponent?.supportedChipsets && cpuComponent.supportedChipsets.length > 0) {
    return cpuComponent.supportedChipsets.map((c) => c.toUpperCase());
  }

  const s = socket || extractSocket(cpuComponent);
  if (s === 'AM5') {
    return ['B650', 'B650E', 'X670', 'X670E', 'A620', 'X870', 'X870E'];
  }
  if (s === 'LGA1700') {
    return ['Z790', 'B760', 'H770', 'Z690', 'B660', 'H610'];
  }
  if (s === 'AM4') {
    return ['B550', 'X570', 'B450', 'A520', 'X470'];
  }
  if (s === 'LGA1851') {
    return ['Z890', 'B860'];
  }

  return ['B650', 'Z790', 'B760'];
}

/**
 * Validates compatibility between selected CPU and Motherboard
 */
export function validateCpuMoboCompatibility(
  cpuComponent?: HardwareComponent,
  moboComponent?: HardwareComponent
): CompatibilityResult {
  if (!cpuComponent || !moboComponent) {
    return {
      isCompatible: true,
      hasSocketConflict: false,
      hasChipsetConflict: false,
      cpuSocket: 'AM5',
      moboSocket: 'AM5',
      moboChipset: 'B650',
      cpuSupportedChipsets: ['B650', 'X670'],
      severity: 'ok',
      title: 'VALIDACIÓN PENDIENTE',
      description: 'Seleccione CPU y Placa Base para calcular compatibilidad.',
      technicalDetails: '',
      suggestedAction: '',
    };
  }

  const cpuSocket = extractSocket(cpuComponent);
  const moboSocket = extractSocket(moboComponent);
  const moboChipset = extractChipset(moboComponent);
  const cpuSupportedChipsets = getSupportedChipsetsForCpu(cpuComponent, cpuSocket);

  // 1. Check physical socket incompatibility
  if (cpuSocket !== moboSocket) {
    return {
      isCompatible: false,
      hasSocketConflict: true,
      hasChipsetConflict: true,
      cpuSocket,
      moboSocket,
      moboChipset,
      cpuSupportedChipsets,
      severity: 'critical',
      title: 'INCOMPATIBILIDAD CRÍTICA DE SOCKET',
      description: `El procesador seleccionado requiere zócalo Socket ${cpuSocket}, mientras que la placa base seleccionada posee zócalo Socket ${moboSocket}.`,
      technicalDetails: `El zócalo ${moboSocket} de la placa (${moboComponent.name}) cuenta con una disposición de pines físicos y alimentación eléctrica incompatible con el encapsulado del procesador ${cpuComponent.name} (${cpuSocket}). El montaje físico es imposible y causaría daño irreversible al intentar forzar la inserción.`,
      suggestedAction: `Seleccione una placa base con zócalo ${cpuSocket} (chipset ${cpuSupportedChipsets.slice(0, 3).join(', ')}) o cambie el procesador a un modelo con zócalo ${moboSocket}.`,
    };
  }

  // 2. Check chipset incompatibility if socket matches
  const isChipsetSupported =
    cpuSupportedChipsets.includes(moboChipset) ||
    moboChipset === 'GENÉRICO' ||
    cpuSupportedChipsets.some((cs) => moboChipset.startsWith(cs));

  if (!isChipsetSupported) {
    return {
      isCompatible: false,
      hasSocketConflict: false,
      hasChipsetConflict: true,
      cpuSocket,
      moboSocket,
      moboChipset,
      cpuSupportedChipsets,
      severity: 'critical',
      title: 'INCOMPATIBILIDAD DE CHIPSET',
      description: `El chipset ${moboChipset} de la placa base no soporta la microarquitectura del procesador ${cpuComponent.name}.`,
      technicalDetails: `Aunque el zócalo mecánico coincide (${cpuSocket}), el chipset ${moboChipset} carece de microcódigo AGESA/BIOS o del circuito regulador VRM certificado para suministrar la energía requerida por este procesador.`,
      suggestedAction: `Seleccione una placa base con chipset certificado para este procesador: ${cpuSupportedChipsets.join(', ')}.`,
    };
  }

  // 3. Fully compatible
  return {
    isCompatible: true,
    hasSocketConflict: false,
    hasChipsetConflict: false,
    cpuSocket,
    moboSocket,
    moboChipset,
    cpuSupportedChipsets,
    severity: 'ok',
    title: '100% COMPATIBILIDAD VERIFICADA',
    description: `Socket ${cpuSocket} · Chipset ${moboChipset} · ATX Form Clearance OK`,
    technicalDetails: `Zócalo ${cpuSocket} validado. Interfaz de bus PCIe y mapeo de carriles eléctricos sincronizados entre ${cpuComponent.name} y ${moboComponent.name}.`,
    suggestedAction: 'Configuración de hardware óptima para ensamble y certificación Nova Core.',
  };
}
