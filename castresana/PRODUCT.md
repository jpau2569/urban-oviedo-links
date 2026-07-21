# Castresana OS — Visión maestra del producto

**Castresana OS** · *Sistema operativo inmobiliario premium*

> Capta, responde, organiza, recomienda, automatiza, vende — y enseña resultados.

Un solo sistema para operar una agencia inmobiliaria de principio a fin: desde el primer mensaje de un lead hasta el informe que el propietario ve en su portal privado. Útil hoy para Asesoría Castresana; preparado para venderse mañana a otras agencias.

## 1 · Naming final de módulos

| Módulo | Codename | Claim |
|---|---|---|
| 📊 **Pulso** | Dashboard | El estado del negocio de un vistazo. |
| 💬 **Conversaciones** | Inbox | Cada mensaje, respondido a tiempo. |
| 🏛️ **Cartera** | Properties | Tus inmuebles, impecables y al día. |
| 🔥 **Oportunidades** | Leads | Ningún interesado se enfría. |
| 🎬 **Media Studio** | Vende Todo | Cada inmueble, presentado para vender. |
| 🔐 **Portales privados** | Client & Owner Portals | Clientes y propietarios, a otro nivel. |
| 🗂️ **Archivo** | Documents | Todo documento, en su sitio y firmable. |
| 📈 **Resultados** | Analytics | Decisiones con números, no sensaciones. |
| ⚙️ **Autopiloto** | Automation | El trabajo repetitivo, solo. |
| ✨ **Inteligencia** | AI Insights | Vende Todo piensa contigo. |
| 🎛️ **Ajustes** | Settings | El OS, a la medida de tu agencia. |
| 🗼 **Torre de control** | Admin | Salud, auditoría y lanzamiento. |

Tono de producto: **premium sereno** — castellano cuidado, frases cortas, cero jerga SaaS. "Vende Todo" es el nombre del agente de IA en todo el sistema (respuestas, scoring, recomendaciones de media).

Fuente de verdad en código: `src/lib/os/modules.ts` — la home, la navegación y esta tabla se derivan del mismo registro.

## 2 · Roles

7 roles (`src/types/roles.ts`, matriz en `src/lib/auth/permissions.ts`, aplicada por `roleGuards.ts` en servidor):

- **Super admin** — todo, incluida administración técnica y multi-agencia.
- **Director/a** — todo el negocio, usuarios y configuración; sin administración técnica.
- **Agente** — día a día: cartera, oportunidades, conversaciones, media, portales. Exporta y comparte.
- **Asistente** — apoyo operativo; sin exportar ni compartir fuera.
- **Colaborador externo** — solo cartera/media que se le comparta; nunca datos de clientes.
- **Propietario (portal)** / **Cliente (portal)** — externos, solo lectura vía token.

La matriz de la UI (`RoleMatrix`) se **genera desde la definición real**; las security rules de Firestore se derivarán de la misma matriz para que UI y backend nunca discrepen.

## 3 · Multi-tenant (modo SaaS futuro)

- **Datos**: todo bajo `tenants/{tenantId}/…` en Firestore. Las rules exigen `request.auth.token.tenantId == tenantId` (custom claim al iniciar sesión) → aislamiento por construcción.
- **Resolución**: subdominio (`agencia.castresana.app`) o dominio propio → tenantId; en desarrollo, tenant fijo (`src/lib/tenancy/tenants.ts`).
- **Branding por agencia**: `tenant.branding` pinta variables CSS en el layout; portales, PDFs y piezas del Studio lo heredan.
- **Planes**: Estudio / Agencia / Grupo con límites (usuarios, inmuebles, storage, créditos IA) comprobados **en servidor** al crear recursos.
- **Onboarding de agencia** (V3): asistente equivalente al de agente — nombre, colores, logo, equipo, ciudad, operaciones, canales, idioma y plantillas iniciales.

## 4 · Despliegue y producción

**Plataforma recomendada: Vercel para la app Next.js + Firebase (Auth, Firestore, Storage, Functions) para datos y workers.** Firebase App Hosting es la alternativa si se prefiere todo-en-Google; Vercel da mejor DX para App Router, previews por PR y edge.

- **Entornos**: `staging` (proyecto Firebase propio, datos sintéticos) y `production`. Deploy por rama: `main` → staging, tag → producción.
- **Variables de entorno**: claves Firebase por entorno en Vercel; nunca en el repo. Secretos de servidor (API WhatsApp, render) solo en Functions/Route Handlers.
- **Seguridad**: rules derivadas de la matriz de permisos; tokens de portal con expiración/revocación (hecho); portales `noindex` (hecho); rate-limit en endpoints públicos.
- **Backups**: export diario programado de Firestore a bucket con retención 30 días; runbook de restauración probado en staging.
- **Monitorización**: Sentry (errores cliente/servidor) + alertas de Functions + uptime del dominio; auditoría interna en `tenants/{id}/audit`.
- **Rendimiento**: `next/image` sobre Storage CDN, streaming de Server Components, presupuesto <150 kB de JS inicial (hoy ~110 kB).
- **PWA** *(hecho)*: manifest con accesos directos, iconos maskable, service worker (red-primero en navegaciones con fallback offline elegante, cache-first en estáticos, portales privados excluidos de caché). Pendiente V2: cola offline para acciones de escritura.
- **SEO**: solo las páginas públicas futuras (web de la agencia) se indexan; todo el OS y los portales, `noindex`.
- **Routing**: el middleware resuelve tenant por hostname y protege rutas internas por sesión; los portales quedan fuera del auth (token propio).

**Checklist de producción**: viva en la Torre de control (`/admin`), codificada en `src/lib/deployment/productionChecklist.ts` — 18 puntos con estado real (auth, rules, storage, PWA, QA, legal, backups, recuperación…).

## 5 · Roadmap

| Fase | Meta | Riesgo | Impacto |
|---|---|---|---|
| **V1 — Usable real** | Operar Castresana con datos reales: auth, Firestore/Storage, portales y Studio en producción. | Bajo | La agencia trabaja ya sobre el OS. |
| **V2 — IA e integraciones** | WhatsApp/email en Conversaciones, borradores IA con revisión humana, scoring, render real de vídeo, Autopiloto completo. | Medio | Horas repetitivas eliminadas; respuesta imbatible. |
| **V3 — Otras agencias** | Multi-tenant real, onboarding de agencia, subdominios, planes con límites. 2–3 pilotos. | Medio | El producto deja de ser interno. |
| **V4 — SaaS** | Alta y pago self-service (Stripe), dominios propios, marketplace de plantillas, métricas de producto. | Alto | El software pasa de coste a activo que factura. |

Detalle completo (alcance dentro/fuera, dependencias) en `src/lib/deployment/productionChecklist.ts` → `ROADMAP`, visible en `/admin`.

## 6 · Estado actual del repositorio

Construido y verificado (build estricto + E2E navegador): **Portales privados** (fase 7), **Media Studio / Vende Todo** (fase 8) y el **cierre OS** (fase 9: launcher, ajustes, equipo+roles, integraciones, autopiloto, inteligencia, resultados, torre de control, onboarding). Los módulos Conversaciones, Cartera, Oportunidades, Archivo y Pulso corresponden a fases 1–6 generadas fuera de este repositorio y se integrarán sobre esta base (aparecen "en camino" en el launcher).
