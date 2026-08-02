# Apps móviles modernas — nativo, PWA y 3D en el bolsillo

## Decisión de plataforma (primera pregunta siempre)

| Necesidad | Solución |
|---|---|
| App instalable, acceso a cámara/push/nativo | **Expo (React Native)** — el default |
| "App" que en realidad es una web usable en móvil | **PWA** (manifest + service worker) — más barato y sin stores |
| Equipo/preferencia Dart, UI muy custom | **Flutter** |
| Web existente que quieren "como app" | PWA primero; Capacitor si necesitan store |

Si el usuario dice "app" pero describe una web (landing, catálogo, reservas),
propón PWA y explica el ahorro. Si necesita hardware o stores, Expo.

## Expo — setup canónico

```bash
npx create-expo-app@latest mi-app
# Router de archivos incluido (expo-router). Piezas habituales:
npx expo install expo-image expo-font expo-haptics react-native-reanimated
```

- **Navegación**: `expo-router` (file-based, como Next).
- **Animación**: `react-native-reanimated` v3+ — corre en el hilo de UI,
  60 fps garantizados. `withSpring` para todo lo interactivo.
- **Gestos**: `react-native-gesture-handler`.
- **Haptics**: `expo-haptics` en acciones importantes — la sensación
  "premium" en móvil es 50 % haptics + springs.
- Verifica APIs actuales con Context7 (`/expo/expo`) — Expo cambia por SDK.

## 3D en móvil nativo

- **R3F funciona en React Native**: `@react-three/fiber/native` +
  `expo-gl`. Los mismos componentes de la web, con matices:
  - Modelos cargados vía `useGLTF` con asset local o URL remota.
  - Sin `Environment` con HDRIs pesados — usa luces simples o presets mini.
  - Presupuesto móvil: < 50k triángulos, texturas ≤ 1024 px, dpr 1.
- **Alternativa ligera**: para un solo objeto girable, un carrusel de
  renders PNG pregenerados (36 frames) pesa menos y nunca ratea.
- El 3D en móvil es un condimento (detalle de producto, easter egg), no la
  base de la navegación.

## Diseño móvil que se siente nativo

- **Touch targets** ≥ 44×44 pt. Espaciado generoso entre acciones.
- **Safe areas**: `useSafeAreaInsets()` siempre — nada pegado al notch.
- **Tab bar** inferior para navegación principal (3-5 items); gestos de
  swipe-back respetados.
- **Dark mode**: soporta ambos desde el día 1 con tokens (mismo sistema de
  la web: fondo, superficie, texto, acento).
- **Skeletons** en cargas, nunca spinners a pantalla completa.
- **Tipografía**: escala algo menor que web (display 32-44 pt), interlineado
  cómodo; usa la misma familia que la web del proyecto para coherencia de
  marca.

## PWA — checklist para que parezca app

- `manifest.json` con `display: "standalone"`, iconos maskable 192/512,
  `theme_color` = color de fondo del header.
- Service worker con precache del shell (Workbox o `vite-plugin-pwa`).
- `viewport-fit=cover` + `env(safe-area-inset-*)` en CSS.
- Desactiva el rubber-band donde moleste (`overscroll-behavior: none`).
- Transiciones entre vistas con View Transitions API (progressive
  enhancement).
- El 3D web (Three/R3F) funciona tal cual en PWA — aplica el checklist de
  performance de `stack-3d.md` con presupuesto móvil.

## Publicación

- **Expo**: `eas build` + `eas submit` para App Store / Play Store. La
  preview con Expo Go o development build por QR es la demo perfecta para
  enseñar al cliente en su propio teléfono.
- **PWA**: deploy en Vercel y listo — envía la URL y explica "Añadir a
  pantalla de inicio".
