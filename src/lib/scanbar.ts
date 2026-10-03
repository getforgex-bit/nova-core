// Integración con Scan-bar (contrato: docs/INTEGRACION-WEBS.md del repositorio Scan-bar).
// 1) Componentes agregados desde Scan-bar → se suman al catálogo antes del primer render.
// 2) Cada ensamble a medida (componentes + servicios) recibe su código EAN-13/QR para cobrarlo en caja.
// Sin VITE_SCANBAR_URL (o si Scan-bar no responde) la página funciona exactamente igual que siempre.
import { HARDWARE_CATALOG } from '../data/hardware';
import type { ComponentCategory, HardwareComponent } from '../types';

const TIENDA = 'nova-core';

/** URL de Scan-bar: VITE_SCANBAR_URL al compilar; para pruebas, ?scanbar=http://localhost:3000 (solo localhost). */
function resolverUrl(): string {
  let url = String(import.meta.env.VITE_SCANBAR_URL ?? '').trim();
  try {
    const q = new URLSearchParams(window.location.search).get('scanbar');
    if (q !== null) { if (q) sessionStorage.setItem('scanbar:url', q); else sessionStorage.removeItem('scanbar:url'); }
    const local = sessionStorage.getItem('scanbar:url');
    if (local && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(local)) url = local;
  } catch { /* sin sessionStorage */ }
  return /^https?:\/\//.test(url) ? url.replace(/\/+$/, '') : '';
}
export const SCANBAR_URL = typeof window === 'undefined' ? '' : resolverUrl();

export const formatearGtin = (g: string) => `${g[0]} ${g.slice(1, 7)} ${g.slice(7)}`;

type Variante = { sku: string; label: string | null; priceCents: number; inStock: boolean };
type ProductoScanbar = { sku: string; name: string; category: string; description: string; imageUrl: string | null; attrs: Record<string, unknown>; variants: Variante[] };

const CATEGORIAS: ComponentCategory[] = ['cpu', 'gpu', 'ram', 'ssd', 'mobo', 'psu', 'perif', 'audio', 'adapters', 'thermal', 'chassis'];
const SKU = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const urlSegura = (u: unknown) => { try { const x = new URL(String(u)); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };
const texto = (v: unknown) => (typeof v === 'string' ? v : undefined);
const numero = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

/**
 * Producto de Scan-bar → componente del catálogo. Categoría = la de Nova Core (cpu, gpu, ram, ssd, mobo, psu…);
 * atributos opcionales para la compatibilidad: marca, socket, chipset, chipsets (lista), tdp_w. Variantes → variantes.
 */
function aComponente(p: ProductoScanbar): HardwareComponent | null {
  const cat = p.category as ComponentCategory;
  const vs = Array.isArray(p.variants) ? p.variants.filter((v) => SKU.test(v.sku) && Number.isInteger(v.priceCents)) : [];
  if (!CATEGORIAS.includes(cat) || !SKU.test(p.sku) || !vs.length || HARDWARE_CATALOG.some((c) => c.sku === vs[0].sku)) return null;
  const a = p.attrs ?? {};
  const chipsets = Array.isArray(a.chipsets) ? a.chipsets.filter((c): c is string => typeof c === 'string') : undefined;
  const base = vs[0];
  return {
    id: `scanbar-${p.sku}`, sku: base.sku, brand: texto(a.marca) ?? 'NOVA CORE', category: cat,
    name: String(p.name), subtitle: String(p.description ?? ''), price: base.priceCents / 100,
    image: urlSegura(p.imageUrl) || HARDWARE_CATALOG.find((c) => c.category === cat)?.image || HARDWARE_CATALOG[0].image,
    badgeTopLeft: 'NUEVO', tdpWattage: numero(a.tdp_w), socket: texto(a.socket), chipset: texto(a.chipset), supportedChipsets: chipsets,
    specs: [], stockTag: base.inStock ? 'EN STOCK' : 'AGOTADO',
    variants: vs.length > 1 ? vs.map((v) => ({ id: v.sku, name: v.label ?? v.sku, sku: v.sku, price: v.priceCents / 100 })) : undefined,
  };
}

/**
 * Suma al catálogo los componentes agregados desde Scan-bar, antes del primer render. Con copia guardada
 * es inmediato (y se refresca para la siguiente visita); la primera vez espera como máximo 1.5 s.
 */
export function cargarExtrasScanbar(): Promise<void> {
  if (!SCANBAR_URL) return Promise.resolve();
  const clave = `scanbar:catalogo:${TIENDA}`;
  const aplicar = (lista: unknown) => {
    if (!Array.isArray(lista)) return;
    HARDWARE_CATALOG.push(...lista.map((p) => aComponente(p as ProductoScanbar)).filter((c): c is HardwareComponent => c !== null));
  };
  const fresco = fetch(`${SCANBAR_URL}/v1/public/t/${TIENDA}/catalog`, { credentials: 'omit', signal: AbortSignal.timeout(8000) })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Scan-bar respondió ${r.status}`))))
    .then((r) => { const lista = Array.isArray(r?.products) ? r.products : []; try { localStorage.setItem(clave, JSON.stringify(lista)); } catch { /* lleno */ } return lista; })
    .catch((e) => { console.warn('Scan-bar no disponible:', e.message); return null; });
  let copia: unknown = null;
  try { copia = JSON.parse(localStorage.getItem(clave) ?? 'null'); } catch { /* copia ilegible */ }
  if (Array.isArray(copia)) { aplicar(copia); return Promise.resolve(); }
  return Promise.race([fresco.then(aplicar), new Promise<void>((ok) => setTimeout(ok, 1500))]);
}

/** Pide a Scan-bar el código de un ensamble. null si Scan-bar no está configurado o no respondió. */
export async function registrarEnsamble(skus: string[]): Promise<{ gtin: string; totalCents: number } | null> {
  if (!SCANBAR_URL) return null;
  try {
    const r = await fetch(`${SCANBAR_URL}/v1/public/t/${TIENDA}/configurations`, {
      method: 'POST', credentials: 'omit', signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'web' },
      body: JSON.stringify({ label: 'Ensamble', lines: skus.map((sku) => ({ sku, qty: 1 })) }),
    });
    const body = await r.json().catch(() => null);
    if (!r.ok) throw new Error(body?.message ?? `Scan-bar respondió ${r.status}`);
    return /^\d{13}$/.test(body?.gtin) ? { gtin: body.gtin, totalCents: body.totalCents } : null;
  } catch (e) {
    console.warn('Scan-bar: no se pudo registrar el ensamble:', (e as Error).message);
    return null;
  }
}
