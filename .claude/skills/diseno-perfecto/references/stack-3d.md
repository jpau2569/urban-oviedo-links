# Stack 3D para web — patrones y trampas

Guía técnica para montar 3D en la web con rendimiento y elegancia. Antes de
usar cualquier API concreta, verifica la versión actual con Context7 — R3F y
drei rompen APIs entre versiones mayores.

## Elección de motor

| Caso | Usa |
|---|---|
| Proyecto React/Next.js | **React Three Fiber (R3F) + drei** — declarativo, ecosistema enorme |
| HTML estático / sin build | **Three.js vanilla** vía `<script type="module">` + import maps desde CDN |
| Escena diseñada visualmente sin código | **Spline** (spline.design) exporta a viewer embebible o código React |
| Shaders puros de fondo | Canvas WebGL propio o **OGL** (más ligero que Three) |
| Máximo rendimiento futuro | **WebGPU** (Three soporta `WebGPURenderer`) — aún con fallback WebGL obligatorio |

## Setup R3F canónico

```bash
npm i three @react-three/fiber @react-three/drei
# opcionales según proyecto:
npm i @react-three/postprocessing @react-three/rapier gsap framer-motion
```

```jsx
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import { Suspense } from 'react'

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 2]}                    // clamp de pixel ratio: clave en móvil
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5}>
          <Modelo />
        </Float>
        <Environment preset="city" />
        <ContactShadows opacity={0.4} blur={2.5} />
      </Suspense>
    </Canvas>
  )
}
```

Claves:
- `dpr={[1, 2]}` siempre — un iPhone con dpr 3 sin clamp funde la GPU.
- `frameloop="demand"` si la escena solo cambia con interacción (ahorra batería).
- El `<Canvas>` vive dentro de un contenedor con tamaño definido
  (`position: absolute; inset: 0` dentro de un hero `position: relative`).
- Carga modelos con `useGLTF` de drei (incluye caché y draco automático):
  `const { scene } = useGLTF('/modelo.glb')`.

## Three.js vanilla sin build (para HTML estático)

```html
<script type="importmap">
{ "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
} }
</script>
<script type="module">
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  // escena estándar: renderer con antialias, clamp de pixelRatio,
  // resize handler, y requestAnimationFrame
</script>
```

Trampa conocida: mezclar versiones de `three` y `three/addons` de CDNs
distintos rompe en silencio. Usa la misma versión pinneada en ambos.

## Los 5 patrones que cubren el 90 % de las webs 3D

1. **Objeto héroe flotante**: GLB centrado + `Float` + `Environment` +
   rotación suave que sigue al ratero (`useFrame` + lerp hacia
   `state.pointer`). El clásico de landing de producto.
2. **Partículas / campo de puntos**: `THREE.Points` con `BufferGeometry`
   (5k-50k puntos), animadas en el vértex shader. Fondo ambiental barato y
   espectacular.
3. **Blob orgánico**: `IcosahedronGeometry` de alta subdivisión + shader de
   ruido simplex desplazando vértices + `MeshTransmissionMaterial` (drei)
   para efecto cristal.
4. **Scroll-driven camera**: la cámara viaja por la escena al hacer scroll.
   Con R3F usa `ScrollControls`/`useScroll` de drei; con vanilla, GSAP
   ScrollTrigger mutando `camera.position` en un timeline.
5. **Configurador**: mismo modelo, materiales intercambiables desde la UI
   (estado React → props de material). Ideal e-commerce.

## Formatos y optimización de modelos

- **Formato**: siempre `.glb` (GLTF binario). Nunca OBJ/FBX en producción.
- **Compresión**: Draco o Meshopt vía `gltf-transform`:
  `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`
- **Presupuesto**: modelo héroe < 2 MB comprimido, < 100k triángulos.
  Texturas ≤ 2048px, WebP/KTX2.
- **Fuentes de modelos gratuitos**: Sketchfab (filtro CC), Poly Haven
  (modelos + HDRIs), Quaternius, Kenney. Generación con IA: ver
  `herramientas-ia.md`.

## Postprocesado con gusto

`@react-three/postprocessing`: `Bloom` (intensidad baja, 0.3-0.8, solo sobre
materiales emisivos), `DepthOfField` sutil, `Noise` al 2-4 % para textura
fílmica, `Vignette` suave. Regla: si se nota el efecto antes que la escena,
bájalo a la mitad.

## Performance — checklist

- [ ] `dpr` clampeado; en móvil considera `dpr={1}`.
- [ ] Luces: máximo 2-3; prefiere `Environment` (IBL) a muchas puntuales.
- [ ] Sombras: `ContactShadows` (baratas) antes que shadow maps reales.
- [ ] Geometrías y materiales reutilizados (instancing con `InstancedMesh`
      si hay >100 objetos iguales).
- [ ] `useGLTF.preload('/modelo.glb')` para evitar pop-in.
- [ ] Pausa el render cuando el canvas sale del viewport
      (IntersectionObserver + `frameloop`).
- [ ] Detecta GPU débil con `detect-gpu` y degrada (menos partículas, sin
      postprocesado).

## Fallback obligatorio

```jsx
const [webglOK] = useState(() => {
  try { const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl')) }
  catch { return false }
})
if (!webglOK || prefersReducedMotion) return <HeroEstatico />  // imagen/gradiente
```

El fallback no es un error 404 visual: es una versión estática igual de
cuidada (captura renderizada del modelo, o gradiente animado por CSS).
