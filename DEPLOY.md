# Cómo subir Ayuda de Negocios JPMR a jpaumoralejo.es (Hostinger)

Esta app es **un único archivo HTML** sin build, sin dependencias y sin servidor. Solo necesitas subirla.

## Opción A — File Manager (la más fácil, 2 minutos)

1. Entra en [hpanel.hostinger.com](https://hpanel.hostinger.com) con tu cuenta.
2. Selecciona el dominio **jpaumoralejo.es** → **Administrar**.
3. En el menú lateral pulsa **File Manager** (Administrador de archivos).
4. Entra en la carpeta **`public_html/`**.
5. Decide dónde quieres que viva la app:
   - **Como página principal** (`jpaumoralejo.es` → abre la app):
     - Sube **`app.html`** y renómbralo a **`index.html`** (sobreescribiendo el actual si lo hay).
   - **Como subruta** (`jpaumoralejo.es/jpmr` → abre la app):
     - Crea la carpeta `jpmr/` dentro de `public_html/`.
     - Dentro de ella, sube `app.html` renombrado a `index.html`.
6. Listo. Abre la URL en el navegador.

> Hay dos archivos idénticos a propósito:
> - `constructor.html` → versión de desarrollo (la que estamos editando).
> - `app.html` → copia 1:1 lista para renombrar a `index.html` y subir.

## Opción B — FTP (con FileZilla)

1. En Hostinger → **Avanzado → Cuentas FTP**: crea o copia las credenciales.
2. Abre FileZilla y conecta:
   - Servidor: `ftp.jpaumoralejo.es` (o el que indique Hostinger)
   - Usuario / contraseña: los de la cuenta FTP
   - Puerto: 21
3. Arrastra `app.html` a `/public_html/` y renómbralo a `index.html`.

## Opción C — Git automático (Hostinger Git)

Si activas Git en Hostinger:
1. **Hostinger → Avanzado → Git**.
2. Conecta el repo `jpau2569/urban-oviedo-links` y la rama `claude/build-constructor-replica-gyOeO`.
3. Path de despliegue: `public_html/` · archivo de entrada: `app.html`.
4. Cada `git push` desplegará automáticamente.

## Subdominios sugeridos (opcional)

En Hostinger → **Dominios → Subdominios → Crear**:
- **`negocios.jpaumoralejo.es`** → la suite completa Ayuda de Negocios JPMR.
- **`render.jpaumoralejo.es`** → para entregar Castresana Render AI por separado a clientes inmobiliarios.

Apunta los subdominios a la misma carpeta donde dejaste `app.html` renombrado a `index.html`.

## Notas

- App **100% cliente** (JavaScript puro, sin backend). Todo se guarda en `localStorage` del navegador del usuario.
- Funciona en HTTP y HTTPS. Hostinger da SSL gratis con Let's Encrypt — actívalo en **SSL → Instalar SSL**.
- Es **PWA instalable**: tu cliente puede pulsar "Añadir a pantalla de inicio" en el móvil y la usa como app nativa con icono propio.
- **Sin tracking**: no envía datos a ningún servidor externo. Las claves API (Anthropic / Google / OpenAI) si las configuras en Ajustes se guardan **solo en el navegador del usuario final**.

## Si quieres conectar IA real

En **Ajustes → Claves API** acepta:
- `sk-ant-…` de Anthropic (Claude)
- `AIza…` de Google (Gemini)
- `sk-…` de OpenAI

Las llamadas se hacen directamente desde el navegador del cliente.

## ¿Qué incluye esta versión?

- **Dashboard** con recursos personalizados y 12 cards de paso/bonus.
- **Mapa de Ruta** con 11 pestañas guiadas: áreas de marketing → soluciones → nicho → ofertas → landings → SignalCore → CRM → Analizador Web → scripts → prospección → métricas.
- **Creador de contenido**: Flyer Creator con IA simulada.
- **Castresana Render AI** (integrada): renderiza fichas 3D top-down de inmuebles con formulario completo, marca de agua, descarga PNG 4K, brochure A4 imprimible, envío directo por WhatsApp.
- **Mis Proyectos**: multi-proyecto con CRUD persistente.
- **Ajustes**: tema claro/oscuro, idioma, API keys, export/import JSON, reset.
- **Apps externas Hub**: registra y previsualiza Manus / Base44 / Vercel.
- **Ayuda**: qué es la plataforma + análisis técnico + herramientas gratuitas (Claude, Gemini, Codex).
- **Command Palette** (⌘K / Ctrl+K) con +25 acciones.
- **Onboarding** la primera vez.
- **Autoguardado** en localStorage con indicador visual.
