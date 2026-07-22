# Castresana OS

**Sistema operativo inmobiliario premium.** Portales privados (fase 7), Media Studio / Vende Todo (fase 8) y el cierre maestro del producto (fase 9: launcher, roles y permisos, ajustes, analytics, torre de control, onboarding y base multi-tenant), como app Next.js (App Router) con TypeScript estricto.

📖 Visión de producto, naming de módulos, plan de despliegue, checklist de producción y roadmap V1–V4: **[PRODUCT.md](./PRODUCT.md)**.

**PWA instalable**: manifest con accesos directos (Resultados, Media Studio, Torre de control), iconos maskable y service worker con modo offline — desde Chrome/Edge/Android: «Instalar aplicación»; desde iOS Safari: «Añadir a pantalla de inicio».

## Arranque

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (typecheck estricto incluido)
```

**Accesos de demostración**

| Pantalla | URL |
|---|---|
| Launcher del OS | `/` |
| Resultados (analytics) | `/analytics` |
| Ajustes (7 secciones) | `/settings` |
| Torre de control (admin) | `/admin` |
| Onboarding de agente | `/onboarding` |
| Cliente (Lucía) | `/client-portal/demo-cliente` |
| Propietario (Javier) | `/owner-portal/demo-propietario` |
| Enlace caducado | `/client-portal/demo-caducado` |
| Media Studio | `/media-studio` |
| Estudio de un inmueble | `/media-studio/p-001` (+ `/storyboard`, `/exports`) |

## Arquitectura

```
src/
├─ app/
│  ├─ client-portal/[token]/            Home del cliente (selección curada + próximos pasos)
│  │  ├─ properties/[id]/               Ficha premium con nota personal del agente
│  │  ├─ visits/                        Visitas + elección de franjas propuestas
│  │  ├─ messages/                      Seguimiento: pasos + resumen de conversaciones
│  │  └─ documents/                     Biblioteca de dosieres e informes
│  └─ owner-portal/[token]/             Resumen: estado, métricas, embudo, feedback
│     ├─ activity/                      Timeline comercial + visitas + comunicaciones
│     └─ documents/                     Archivo del inmueble (contratos, certificados…)
├─ components/portal/                   12 componentes reutilizables (shell, tarjetas, métricas…)
├─ lib/portal/
│  ├─ accessTokens.ts                   Generación/validación de enlaces mágicos con expiración
│  ├─ portalPermissions.ts              Matriz rol → permisos (solo lectura por defecto)
│  ├─ portalQueries.ts                  Contrato PortalRepository + implementación mock
│  ├─ portalViewModels.ts               Composición de datos → view-models por pantalla
│  └─ mockData.ts                       Dataset con la forma exacta de Firestore
└─ types/portal.ts                      Modelo completo (sesiones, selecciones, visitas, métricas…)
```

### Modelo de acceso

- Enlace mágico con token opaco de 128 bits: `/{portal}/{token}`.
- El token vive en `portalTokens/{token}` con rol, sujeto, expiración, revocación y scopes opcionales.
- Toda página valida el token **en servidor** antes de renderizar; token inválido → pantalla de acceso con motivo (caducado / revocado / no encontrado / rol equivocado).
- Solo lectura por defecto. Escrituras del cliente (interés, franjas de visita) pasarán por Route Handlers que re-validan token + scope. `approve:actions` queda declarado para la fase de aprobaciones del propietario.
- `robots: noindex` global: los portales jamás se indexan.

### Paso a producción (Firebase)

1. Implementar `firestoreRepository` con el contrato `PortalRepository` (colecciones homónimas a `mockData.ts`).
2. Cambiar el export `repo` en `portalQueries.ts`.
3. Servir documentos con URLs firmadas de Storage generadas tras validar el token.
4. Crear tokens desde el panel interno («Compartir portal con…»).

Ni páginas ni componentes necesitan cambios: solo la capa de datos.
