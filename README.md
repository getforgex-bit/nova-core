# NOVA CORE // HARDWARE LAB

Catálogo de componentes, ensamble a medida, packs y servicios técnicos (React + Vite). `bun install` · `bun run dev` · `bun run build`.

## Publicar en Cloudflare

Se publica como Worker de assets estáticos (`wrangler.jsonc`). Dos formas:

- **Desde GitHub** (cada push a `main` publica): Workers & Pages → Create → **Import a repository** → este repositorio. Build command: `npm run build`; Deploy command: `npx wrangler deploy`.
- **Desde la terminal**: `npx wrangler login` (una vez) y `npm run deploy` (compila y publica `dist/`).

Queda en `https://nova-core.<tu-cuenta>.workers.dev`. Usa Workers y no Pages: en la misma cuenta que Scan-bar, la página lo encuentra sola y Scan-bar sabe a qué URL mandar sus códigos. Pasos de todo el sistema: `docs/DESPLIEGUE.md` en el repositorio Scan-bar.

## Scan-bar (catálogo y códigos)

Scan-bar es la base de datos de productos y códigos de barras de los negocios (`src/lib/scanbar.ts`):

- `src/data/hardware.ts`, `packs.ts` y `services.ts` se registran solos en Scan-bar (Scan-bar revisa este repositorio cada 10 minutos; `npm run sync:repos` allá lo fuerza): cada componente y cada variante tiene su código, igual que los servicios del ensamble (`BUILD_SERVICES`).
- **Cada ensamble a medida** (componentes de los slots + servicios elegidos) recibe su código al *Proceder al pedido de ensamble* o al *Guardar presupuesto PDF*: aparece en el carrito y como código de barras en el PDF para cobrarlo en caja escaneándolo.
- Los componentes agregados desde Scan-bar (*Administración → Productos y etiquetas*) se suman al catálogo y al selector de slots: categoría de Nova Core (`cpu`, `gpu`, `ram`, `ssd`, `mobo`, `psu`…), atributos opcionales `marca`, `socket`, `chipset`, `chipsets`, `tdp_w`.
- Conexión: automática si la página vive en `nova-core.<tu-cuenta>.workers.dev` (usa `scan-bar.<tu-cuenta>.workers.dev`). En otro dominio: `VITE_SCANBAR_URL=https://URL-DE-SCAN-BAR` al compilar (ver `.env.example`); `VITE_SCANBAR_URL=off` la apaga.
- Probar en local: Scan-bar en otro puerto (`PORT=3001 npm start` allá), `bun run dev` aquí y abrir `http://localhost:3000/?scanbar=http://localhost:3001` (solo acepta localhost).
- Contrato y diseño completo: `docs/INTEGRACION-WEBS.md` en el repositorio Scan-bar.
