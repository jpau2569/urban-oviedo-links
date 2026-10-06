# Herramientas de internet + IA — el arsenal conectado a Claude

Cómo usar los MCPs y servicios disponibles en cada fase del proyecto. Usa la
herramienta real cuando esté conectada; si no lo está, dilo y ofrece la
alternativa manual.

## Figma (MCP `mcp__Figma__*`)

**Diseño → código** (el usuario pega URL de figma.com):
1. `get_design_context` con la URL/node — devuelve estructura, estilos y
   tokens del diseño.
2. `get_screenshot` para validar visualmente que tu implementación es fiel.
3. `get_variable_defs` si el archivo tiene variables (tokens) — úsalas como
   fuente de verdad para tu CSS.

**Código → Figma** (empujar tu diseño para que el usuario lo edite):
- Carga SIEMPRE la skill `figma-use` antes de llamar a `use_figma`.
- Para generar una página entera desde el layout construido, sigue la skill
  `figma-generate-design`.

**Diagramas de flujo/arquitectura**: `generate_diagram` (FigJam) — útil para
presentar la arquitectura de la app al cliente.

## Higgsfield (MCP `mcp__higgsfield__*`) — assets generativos

- **Imagen** (`generate_image`): heros, texturas, fondos, mockups de
  producto. Pide estilo concreto en el prompt ("studio lighting, dark
  background, product photography") — no prompts vagos.
- **Imagen → 3D** (`generate_3d`): convierte una imagen en malla GLB.
  Flujo completo para un objeto héroe que no existe:
  1. `generate_image` del objeto sobre fondo neutro, vista 3/4.
  2. `generate_3d` sobre esa imagen → GLB.
  3. Optimiza: `npx @gltf-transform/cli optimize in.glb out.glb --compress draco`.
  4. Cárgalo con `useGLTF` (ver `stack-3d.md`).
- **Vídeo** (`generate_video`): clips de fondo para heros
  (`<video autoplay muted loop playsinline>`) — comprímelos a < 4 MB.
- Si no sabes qué modelo generativo usar: `models_explore(action:'recommend')`.

**Fuentes no-IA de assets 3D** (a veces mejores y más rápidas):
- Poly Haven — HDRIs (para `Environment`) y modelos PBR, CC0.
- Sketchfab — filtra por licencia CC, descarga GLB directo.
- Quaternius / Kenney — packs low-poly con estilo, CC0.
- Primitivas + shaders: un blob con ruido bien iluminado no necesita asset.

## Context7 (MCP `mcp__Context7__*`) — docs siempre actuales

Antes de escribir código contra cualquier librería del stack:
1. `resolve-library-id` ("react-three-fiber", "drei", "gsap", "expo"...).
2. `query-docs` con la duda concreta ("ScrollControls usage", "useGLTF
   draco").

Úsalo especialmente en: R3F/drei (APIs cambian entre majors), Tailwind v4
(config CSS-first, distinta a v3), Expo (por SDK), Next.js (App Router).

## Vercel (MCP `mcp__Vercel__*`) — deploy y feedback

- `deploy_to_vercel` para publicar el proyecto y devolver URL real — la
  mejor entrega es un enlace que el cliente abre en su móvil.
- `get_deployment_build_logs` cuando el build falle en la nube pero no en
  local.
- `web_fetch_vercel_url` / `get_runtime_errors` para verificar la página
  desplegada.
- Alternativa sin MCP: `npx vercel --prod` (requiere login del usuario).

## Supabase (MCP `mcp__Supabase__*`) — backend cuando la app lo pide

Para apps con datos (auth, reservas, catálogo): tablas + RLS con
`apply_migration`, tipos con `generate_typescript_types`, y
`get_publishable_keys` + `get_project_url` para configurar el cliente.
Revisa `get_advisors` (seguridad) antes de entregar.

## Playwright (preinstalado) — QA visual automático

Chromium está en `/opt/pw-browsers`. Úsalo para verte a ti mismo el
resultado:

```js
// screenshot.mjs — npx playwright screenshot no cubre viewports múltiples
import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [name, vp] of Object.entries({
  movil: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
})) {
  const page = await b.newPage({ viewport: vp })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  await page.screenshot({ path: `qa-${name}.png`, fullPage: true })
}
await b.close()
```

Mira los PNG con la herramienta Read y corrige lo que no esté a la altura
ANTES de entregar. Este ciclo (render → mirar → corregir) es lo que convierte
"código que compila" en "diseño perfecto".

## Orden típico de un proyecto completo

1. Visión (SKILL.md fase 1) → 2. Context7 para el stack → 3. Construcción →
4. Assets con Higgsfield/Poly Haven → 5. QA con Playwright →
6. Deploy con Vercel → 7. (Opcional) push del diseño a Figma para iterar.
