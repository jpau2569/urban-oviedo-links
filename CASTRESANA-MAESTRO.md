# 🏛️ CASTRESANA — Documento Maestro del Proyecto

> Todo lo construido, dónde está y cómo se usa. Actualizado: 22 · julio · 2026

---

## 1 · Enlaces de uso

| Qué | Enlace |
|---|---|
| **Suite (usar ya, en el navegador)** | https://claude.ai/code/artifact/a80476e1-05aa-45f3-a5c2-1aef058824f9 |
| **Ayuda de Negocios JPMR** (herramienta) | `jpmr.html` — botón 🧰 en la Suite y en el launcher del OS · en el VPS: `http://82.29.170.102:3010/jpmr.html` |
| **Repositorio (GitHub, público)** | https://github.com/jpau2569/urban-oviedo-links |
| **Pull Request a `main`** | https://github.com/jpau2569/urban-oviedo-links/pull/2 |
| **Tu VPS Hostinger** (tras instalar) | `http://82.29.170.102:3010/` (OS) · `http://82.29.170.102:3010/suite.html` (Suite) |
| **Supabase (tu proyecto)** | `qwljkqisnupjgzbdyzym` · Frankfurt (eu-central-1) |

### Instalar/actualizar en tu VPS (un solo comando)

Entra en **hPanel → VPS srv1518906 → Terminal del navegador** (o `ssh root@82.29.170.102`) y pega:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/jpau2569/urban-oviedo-links/claude/inmobiliaria-app-improvements-dsm8dy/castresana/deploy/hostinger.sh)
```

Idempotente: pegarlo de nuevo = actualizar. No toca OpenClaw (puerto 40846). Para HTTPS + instalar como app en el móvil: `castresana/deploy/README.md`.

---

## 2 · 🏙️ Castresana Suite (`inmobiliaria.html` / `suite.html`)

**App de un solo archivo HTML** — se abre con doble clic, funciona sin servidor. Interfaz **neón futurista** (cian/magenta, retícula, tarjetas 3D que siguen al ratón), modo claro/oscuro.

| Módulo | Qué hace |
|---|---|
| 📊 **Panel** | KPIs animados, gráficos (donut, barras), visitas de hoy, matches, actividad |
| 🏘️ **Propiedades** | Alta con fotos (compresión automática) y **vídeos reales** (hasta 60 MB, IndexedDB), referencia AC-XXXX, extras, estados, buscador + filtros, galería con teclado, ficha imprimible/PDF, duplicar, WhatsApp |
| 👥 **Clientes** | CRM con perfil (comprador/inquilino/vendedor/propietario), presupuesto, zona — **matching automático** con la cartera y envío de ficha al WhatsApp del cliente |
| 📅 **Agenda** | Visitas por propiedad+cliente agrupadas por día, **📲 enviar la cita al WhatsApp del cliente**, marcar realizada/cancelada |
| 🧮 **Herramientas** | Hipoteca (cuota francesa), rentabilidad de alquiler, honorarios con IVA, comparador €/m² contra tu cartera |
| 🎩 **Agentes** | 6 agentes IA con **reglas sobre TUS datos**: fotos faltantes, matches sin visita, citas sin confirmar, teléfonos vacíos, precios desviados, fichas incompletas. Aprobar = la acción se ejecuta al momento. **Toda decisión queda auditada en local y en la nube** |
| ☁️ **Nube** | Sincronización con Supabase: sube/baja cambios (gana el más reciente), borrados incluidos, chip de estado en cabecera |
| 🔗 **Accesos** | Botones directos a asesoriacastresana.com y CRM Inmoweb |

**Datos**: viven en tu navegador (localStorage + IndexedDB para vídeos) **y** en tu Supabase. Botón *Exportar* ⬇️ para respaldo local en JSON.

> ⚠️ En el enlace claude.ai la nube queda bloqueada por seguridad de esa plataforma (chip "sin conexión") — la sincronización brilla en el VPS o abriendo el archivo local.

---

## 3 · 🏛️ Castresana OS (`castresana/` — Next.js 15, TS estricto, 26 rutas)

**Sistema operativo inmobiliario premium** (estética carbón/nogal/beige/cobre). PWA instalable (manifest + service worker + modo offline).

| Ruta | Módulo |
|---|---|
| `/` | Launcher con los 12 módulos (naming final: Pulso, Conversaciones, Cartera, Oportunidades, Media Studio, Portales, Archivo, Resultados, Autopiloto, Inteligencia, Ajustes, Torre de control) |
| `/client-portal/demo-cliente` | Portal privado del cliente: selección curada con notas del agente, visitas con elección de franjas, seguimiento, documentos |
| `/owner-portal/demo-propietario` | Portal del propietario: métricas, embudo, timeline comercial, feedback de visitas, documentos |
| `/media-studio` | Fábrica de contenido: biblioteca con scoring comercial por foto, storyboards (7 plantillas × 8 canales), export manager, publishing center |
| `/agents` | Equipo de agentes IA con contrato de gobierno (revisión humana, explicabilidad, auditoría, permisos mínimos) |
| `/analytics` | Resultados de negocio: KPIs, leads/velocidad por semana, rendimiento por agente, canales rentables |
| `/settings` (7 pantallas) | Agencia, equipo y roles (matriz generada del código), marca, integraciones, Autopiloto, Inteligencia |
| `/admin` | Torre de control: salud del sistema, colas, auditoría, **checklist de producción (18 puntos)** y **roadmap V1–V4** |
| `/onboarding` | Alta de agente en 5 pasos |
| `/suite.html` | La Suite completa, servida por el mismo dominio |

**Arquitectura de datos — cloud-first con respaldo**: cada lectura intenta Supabase (tabla `castresana_os`, timeout 3 s, caché 10 s) y si la nube falla sirve el dataset local al instante. **El portal no puede caerse por la base de datos** (verificado con kill del servidor). Los **tokens de los portales viven en la nube**: revocar un enlace = editar una fila, sin redeploy.

Documentación completa del producto: `castresana/PRODUCT.md` (visión, naming, multi-tenant, plan de despliegue, roadmap V1–V4).

---

## 3·bis · 🧰 Ayuda de Negocios JPMR (`jpmr.html`)

**Herramienta integrada** en el ecosistema: app de un solo archivo, servida junto a la Suite y el OS. Acceso con un clic desde el botón **🧰** de la cabecera de la Suite y desde la tarjeta del launcher del OS; en el VPS queda en `/jpmr.html`.

| Módulo | Qué hace |
|---|---|
| 🤖 **CLARA IA** | Asistente con paleta de comandos (⌘K) y claves propias (Anthropic/Google/OpenAI/Abacus) guardadas en el navegador |
| 🗺️ **Mapa de Ruta** | Plan de negocio en 11 pasos |
| ✍️ **Creador de contenido** | Flyers y piezas para redes |
| 👥 **Contactos CRM · Proyectos** | Gestión de contactos y proyectos propios |
| 🎨 **Cast Render · LimpiaFotos** | Réplica de Castresana Render IA y editor/limpiador de fotos |

Autónoma (datos en su propio `localStorage`) y PWA instalable. Verificada en navegador real sin errores de código (solo se bloquea la hoja de Google Fonts en el sandbox de claude.ai; usa fuente del sistema como respaldo y carga normal en el VPS o en local).

---

## 4 · ☁️ Supabase (proyecto `qwljkqisnupjgzbdyzym`)

| Tabla | Uso | Acceso clave pública |
|---|---|---|
| `castresana_suite` | Datos de la Suite (propiedades/clientes/visitas, jsonb + tombstones) | lectura + escritura (solo esta tabla) |
| `castresana_agent_audit` | Auditoría de decisiones sobre los agentes IA | lectura + escritura |
| `castresana_os` | 51 entidades del OS en 12 tipos (properties, tokens, visitas, timeline…) | **solo lectura** |

Tus otras 24 tablas quedaron intactas y protegidas. Regenerar seed del OS: `npx tsx castresana/scripts/seed-os.mts`.

---

## 5 · Estado y guardia

- **PR #2 abierto y mergeable** (125 archivos, +14.241 líneas, 11 commits, sin conflictos). Acción tuya: botón **Merge** cuando quieras.
- **Guardia activa**: sesión suscrita a los eventos del PR + ronda automática cada hora hasta merge/cierre.
- **Verificación acumulada**: ~80 checks E2E en navegador real (desktop + móvil), builds TS estrictos, PWA/offline, contratos de red de la sincronización, camino nube y failover.

## 6 · Próximos pasos sugeridos (cuando quieras)

1. **Merge del PR** → todo consolidado en `main` (el instalador del VPS puede apuntarse a `main` después).
2. **HTTPS con dominio** (`os.asesoriacastresana.com`) → instalación como app en móvil (bloque listo en `deploy/README.md`).
3. **V1 real del OS**: login de equipo + escritura desde el OS a `castresana_os` (hoy es lectura) + fotos reales en Storage.
4. **V2**: WhatsApp Business API en Conversaciones, render real de vídeo del Media Studio, informes automáticos a propietarios.

---

*Construido con Claude Code · sesión completa: Suite v1→v4.1 + Castresana OS fases 7–9 + PWA + agentes + nube.*
