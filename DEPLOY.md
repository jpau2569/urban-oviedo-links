# Ayuda de Negocios JPMR — Cómo usarla

Tienes **3 formas** de tenerla online, ordenadas de más rápida a más permanente.

---

## 🚀 Opción 1 — Preview instantáneo (sin hacer nada)

Una vez subidos los archivos al repo, **funciona ya** a través de servicios públicos de preview de GitHub:

**👉 https://raw.githack.com/jpau2569/urban-oviedo-links/claude/build-constructor-replica-gyOeO/app.html**

Alternativas equivalentes (por si una falla):
- https://htmlpreview.github.io/?https://github.com/jpau2569/urban-oviedo-links/blob/claude/build-constructor-replica-gyOeO/app.html
- https://cdn.statically.io/gh/jpau2569/urban-oviedo-links/claude/build-constructor-replica-gyOeO/app.html

**Limitaciones:** ese link cambiará si renombras la rama, y el archivo se sirve desde un CDN — no es para producción seria. Pero para enseñárselo a un cliente, va.

---

## 🌐 Opción 2 — GitHub Pages (link público permanente, gratis)

He dejado el archivo también en `docs/index.html` para que GitHub Pages lo sirva directamente.

1. Ve a https://github.com/jpau2569/urban-oviedo-links/settings/pages
2. En **Source**, elige `Deploy from a branch`.
3. En **Branch**, selecciona `claude/build-constructor-replica-gyOeO` (o `main` si ya lo has mergeado) y la carpeta **`/docs`**.
4. **Save**.
5. Espera 1-2 minutos. URL final:
   - https://jpau2569.github.io/urban-oviedo-links/

Si quieres que sea la raíz del dominio Pages: cambia la fuente a `/ (root)` y mueve el archivo a la raíz, pero entonces se perdería tu Urban Oviedo. Por eso uso `/docs` — no toca nada.

---

## 🏠 Opción 3 — Hostinger en jpaumoralejo.es (producción real)

### A. File Manager (2 minutos)
1. [hpanel.hostinger.com](https://hpanel.hostinger.com) → dominio **jpaumoralejo.es** → **File Manager**.
2. Entra en `public_html/`.
3. Sube `app.html` y renómbralo a `index.html` (sobreescribiendo el actual si lo hay).
4. Abre `jpaumoralejo.es`.

### B. Como subdominio dedicado (`render.jpaumoralejo.es`)
1. Hostinger → **Dominios → Subdominios → Crear** → nombre `render` (o el que quieras).
2. Apunta a una carpeta nueva, por ejemplo `public_html/render/`.
3. Sube `app.html` ahí como `index.html`.
4. Abre `render.jpaumoralejo.es`.

### C. FTP con FileZilla
- Servidor: `ftp.jpaumoralejo.es` (o el que indique Hostinger)
- Usuario / contraseña: los de la cuenta FTP que crees en Hostinger
- Puerto: 21
- Arrastra `app.html` a `/public_html/` y renómbralo a `index.html`.

### D. Auto-deploy con Git
1. Hostinger → **Avanzado → Git** → conectar.
2. Repo: `jpau2569/urban-oviedo-links`. Rama: `claude/build-constructor-replica-gyOeO`.
3. Path: `public_html/`. Archivo de entrada: `app.html` (Hostinger lo servirá como index si lo configuras).
4. Cada `git push` redespliega solo.

---

## 📋 Lista de archivos

| Archivo | Para qué sirve |
|---|---|
| `constructor.html` | Versión de desarrollo (la que se va editando). |
| `app.html` | Copia 1:1 lista para subir a Hostinger. |
| `docs/index.html` | Copia para GitHub Pages (con `.nojekyll`). |
| `index.html` (raíz) | Tu landing original de Urban Oviedo (intacta). |
| `DEPLOY.md` | Este archivo. |

---

## ✨ Qué incluye (v1.2.0)

### Plataforma JPMR Negocios
- **Dashboard** con cards de paso 1-3 + 9 bonus (Higgsfield, Claude para Agencias IA, Meta Ads, Master IA, Automatizaciones, IA Redes, Cierre ventas, Webs IA, Paquetes).
- **Mapa de Ruta** en 11 pestañas: Áreas de Marketing → Soluciones IA → Nicho (con propuesta de valor transformacional) → Ofertas (Front-end/Core/Premium) → Landings → SignalCore → CRM → Analizador Web → Scripts en frío → Apollo+Apify → Métricas (KPIs animados + gráfico SVG + timeline).
- **Creador de contenido**: Flyer Creator con IA simulada o real.
- **Castresana Render AI** integrada: renderizador 3D top-down de inmuebles con datos comerciales, marca de agua, descarga PNG 4K, envío directo por WhatsApp y brochure A4 imprimible.
- **Mis Proyectos**: multi-proyecto con plantillas pre-cargadas (Inmobiliaria, Clínica, Restaurante, Gimnasio, Asesoría, En blanco).
- **Apps externas hub**: registra Manus, Base44, Vercel, Lovable, Bolt, Netlify.
- **Ayuda**: explicación + análisis técnico + herramientas gratuitas (Claude, Gemini, Codex).

### UX / Producto
- **Command Palette** (⌘K / Ctrl+K) con +25 acciones.
- **Onboarding** la primera vez (con click fuera o ESC para cerrar).
- **Atajos de teclado** (`?` para verlos todos).
- **Autoguardado** con indicador en topbar.
- **Tema claro / oscuro**.
- **Bottom navigation** móvil con 5 secciones primarias y CTA central de Render.
- **localStorage** con fallback en memoria si el navegador lo bloquea.
- **PWA instalable** ("Añadir a pantalla de inicio").

### IA real (opcional)
En **Ajustes → Claves API** acepta:
- `sk-ant-…` de Anthropic (Claude Haiku 4.5)
- `AIza…` de Google (Gemini 2.0 Flash)
- `sk-…` de OpenAI

Cuando hay clave, el Analizador de Web y el Generador de Scripts llaman a la IA de verdad. Sin clave usan plantillas locales. **Las claves se guardan solo en el navegador del usuario final.**

---

## 🔒 Seguridad y privacidad

- 100% cliente, sin backend.
- Sin tracking.
- Sin envío de datos a terceros (excepto cuando el usuario invoca la IA con su propia clave).
- localStorage cifrado por el navegador, aislado por dominio.
