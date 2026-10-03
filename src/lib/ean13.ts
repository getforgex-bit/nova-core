// EAN-13 sin dependencias (norma GS1): 95 módulos = guarda + 6 dígitos (L/G) + centro + 6 dígitos (R) + guarda.
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const R = L.map((c) => [...c].map((b) => (b === '0' ? '1' : '0')).join(''));
const G = R.map((c) => [...c].reverse().join(''));
const PARIDAD = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

/** Módulos del símbolo como cadena de "1" (barra) y "0" (espacio). */
export function ean13Modulos(gtin: string): string {
  if (!/^\d{13}$/.test(gtin)) throw new Error('Se esperan 13 dígitos');
  const d = [...gtin].map(Number);
  const izq = d.slice(1, 7).map((n, i) => (PARIDAD[d[0]][i] === 'L' ? L : G)[n]).join('');
  const der = d.slice(7).map((n) => R[n]).join('');
  return `101${izq}01010${der}101`;
}

/** Tramos de barras [inicio, ancho] en módulos, para dibujarlas como rectángulos. */
export function ean13Barras(gtin: string): [number, number][] {
  const m = ean13Modulos(gtin); const out: [number, number][] = [];
  for (let i = 0; i < m.length; i++) if (m[i] === '1') { const s = i; while (m[i + 1] === '1') i++; out.push([s, i - s + 1]); }
  return out;
}
