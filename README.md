# NOVA CORE // HARDWARE LAB

Catálogo de componentes, ensamble a medida, packs y servicios técnicos (React + Vite). `bun install` · `bun run dev` · `bun run build`.

## Scan-bar (catálogo y códigos)

Scan-bar es la base de datos de productos y códigos de barras de los negocios (`src/lib/scanbar.ts`):

- `src/data/hardware.ts`, `packs.ts` y `services.ts` se registran solos en Scan-bar (`npm run sync:repos` allá): cada componente y cada variante tiene su código, igual que los servicios del ensamble (`BUILD_SERVICES`).
- **Cada ensamble a medida** (componentes de los slots + servicios elegidos) recibe su código al *Proceder al pedido de ensamble* o al *Guardar presupuesto PDF*: aparece en el carrito y como código de barras en el PDF para cobrarlo en caja escaneándolo.
- Los componentes agregados desde Scan-bar (*Administración → Productos y etiquetas*) se suman al catálogo y al selector de slots: categoría de Nova Core (`cpu`, `gpu`, `ram`, `ssd`, `mobo`, `psu`…), atributos opcionales `marca`, `socket`, `chipset`, `chipsets`, `tdp_w`.
- Activar: `VITE_SCANBAR_URL=https://URL-DE-SCAN-BAR` al compilar. Sin ella, el sitio funciona igual que siempre.
- Probar en local: Scan-bar en otro puerto (`PORT=3001 npm start` allá), `bun run dev` aquí y abrir `http://localhost:3000/?scanbar=http://localhost:3001` (solo acepta localhost).
- Contrato y diseño completo: `docs/INTEGRACION-WEBS.md` en el repositorio Scan-bar.
