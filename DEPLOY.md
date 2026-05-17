# Cómo subir El Constructor a jpaumoralejo.es (Hostinger)

Esta app es **un único archivo HTML** sin build, sin dependencias y sin servidor. Solo necesitas subirlo.

## Opción A — File Manager (la más fácil, 2 minutos)

1. Entra en [hpanel.hostinger.com](https://hpanel.hostinger.com) con tu cuenta.
2. Selecciona el dominio **jpaumoralejo.es** → **Administrar**.
3. En el menú lateral pulsa **File Manager** (o **Administrador de archivos**).
4. Entra en la carpeta **`public_html/`**.
5. Decide dónde quieres que viva la app:
   - **Como página principal del dominio** (`jpaumoralejo.es` → abre la app):
     - Sube el archivo `constructor.html` y renómbralo a **`index.html`** (sobreescribiendo el actual si lo hay).
   - **Como subruta** (`jpaumoralejo.es/constructor` → abre la app):
     - Crea una carpeta `constructor/` dentro de `public_html/`.
     - Dentro de ella, sube `constructor.html` renombrado a `index.html`.
6. Listo. Abre la URL en el navegador.

> En este repo te he dejado dos archivos idénticos a propósito:
> - `constructor.html` → versión de desarrollo (la que estamos editando).
> - `app.html` → copia 1:1 lista para renombrar a `index.html` y subir.

## Opción B — FTP (con FileZilla)

1. En Hostinger, **Avanzado → Cuentas FTP**: crea o copia las credenciales.
2. Abre FileZilla y conecta:
   - Servidor: `ftp.jpaumoralejo.es` (o el que indique Hostinger)
   - Usuario / contraseña: los de la cuenta FTP
   - Puerto: 21
3. Arrastra `constructor.html` a `/public_html/` y renómbralo a `index.html`.

## Opción C — Vía Git (si activas Git en Hostinger)

Hostinger permite conectar un repo de GitHub a un dominio. Si lo activas:
1. **Hostinger → Avanzado → Git**.
2. Conecta este repo (`jpau2569/urban-oviedo-links`) y la rama `claude/build-constructor-replica-gyOeO`.
3. Configura el path de despliegue a `public_html/` y archivo de entrada `constructor.html`.
4. Cada `git push` desplegará automáticamente.

## Notas

- La app es **completamente cliente** (JavaScript puro, sin backend). Todo se guarda en `localStorage` del navegador del usuario.
- Funciona en HTTP y HTTPS. Hostinger ya da SSL gratis con Let's Encrypt — asegúrate de tenerlo activo.
- Si quieres dominio propio para esta app (ej. `constructor.jpaumoralejo.es`):
  - **Subdominios → Crear subdominio → `constructor`** y apunta a la misma carpeta.
- Es PWA: tu cliente puede pulsar "Añadir a pantalla de inicio" en el móvil y la usa como app nativa.

## Si quieres que conecte con IA real

En la app, **Ajustes → Claves API** acepta:
- `sk-ant-…` de Anthropic (Claude)
- `AIza…` de Google (Gemini)
- `sk-…` de OpenAI

Las claves se guardan **solo en el navegador del usuario final**, nunca se envían a otro servidor. Las llamadas a la API se hacen directamente desde el navegador del cliente.
