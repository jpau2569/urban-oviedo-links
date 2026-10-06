# Visión y UI — dirección de arte que no parece plantilla

El código se copia; el gusto no. Esta referencia condensa las decisiones que
separan una web premium de una genérica.

## Tipografía

- **Par tipográfico**: una display con carácter + una de texto neutra.
  Combos probados (Google Fonts / Fontshare, gratis):
  - Clash Display + Inter — tech premium
  - Playfair Display + Söhne/Inter — lujo editorial
  - Space Grotesk + IBM Plex Sans — ingeniería moderna
  - General Sans + Satoshi — SaaS limpio (ambas en Fontshare)
  - Instrument Serif + Instrument Sans — boutique 2024+
- **Escala fluida**: `font-size: clamp(2.5rem, 8vw, 7rem)` para el hero.
  El titular grande de verdad (ocupando el ancho) es la señal nº 1 de web
  premium.
- **Detalles**: `letter-spacing: -0.02em` a `-0.04em` en display grande;
  `text-wrap: balance` en titulares; nunca justificar párrafos.
- Carga con `font-display: swap` y preload del woff2 de la display.

## Color

- **Estructura**: 1 fondo dominante + 1 acento + 2-3 neutros. Punto.
- **Fondo oscuro** favorece al 3D y al glow: no negro puro — `#0A0A0B`,
  `#0D0F14`, o un oscuro con tinte del acento.
- **Fondo claro** premium: no blanco puro — `#FAFAF8`, `#F4F1EC` (cálido).
- **El acento se usa poco**: CTA, un highlight en el titular, detalles.
  Si todo es acento, nada lo es.
- Define todo como tokens CSS:

```css
:root {
  --bg: #0A0A0B; --surface: #141417; --text: #F5F5F4;
  --muted: #8A8A93; --accent: #D8FF3E; --radius: 16px;
}
```

- Contraste AA mínimo (4.5:1 texto normal, 3:1 texto grande). Compruébalo,
  sobre todo acento-sobre-oscuro.

## Layout y espacio

- **Aire vertical**: secciones con `padding-block: clamp(4rem, 12vh, 10rem)`.
  El miedo al espacio vacío es el error nº 1 del diseño amateur.
- **Grid con intención**: 12 columnas, pero rompe la simetría — texto en
  5 columnas y visual en 6 desplazado, no todo centrado.
- **Anchos de lectura**: párrafos a max 65-75 caracteres (`max-width: 65ch`).
- **Jerarquía por sección**: cada viewport de scroll tiene UN elemento
  dominante. Si compiten dos, quita uno.

## Motion

- **Easings**: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) para entradas;
  springs (Framer Motion: `type: "spring", stiffness: 100, damping: 20`)
  para interacciones. Prohibido `linear` y `ease` por defecto.
- **Entrance on scroll**: fade + translateY(20-40px), duración 600-800 ms,
  stagger 80-120 ms entre hermanos. Con GSAP ScrollTrigger o
  IntersectionObserver + clases.
- **Micro-interacciones**: hover de botones con scale(1.02-1.05) + cambio
  de sombra; magnetic buttons solo si el tono es juguetón.
- **Un momento "wow" por página**: transición de hero, texto que se revela
  por líneas (SplitText o máscaras CSS), o el 3D reaccionando al scroll.
  El resto del motion, discreto.
- **`prefers-reduced-motion`**: envuelve TODO el motion no esencial:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important; }
}
```

## Texturas de la era actual (usar con criterio)

- **Glassmorphism**: `backdrop-filter: blur(20px)` + borde
  `1px solid rgb(255 255 255 / 0.1)` + fondo `rgb(255 255 255 / 0.05)`.
  Para navbars y cards sobre 3D. No para todo.
- **Grain/noise**: overlay de ruido al 3-5 % (SVG `feTurbulence` o PNG)
  quita el look "plástico digital".
- **Glow**: sombras del color del acento (`box-shadow: 0 0 60px -15px
  var(--accent)`) en CTAs y elementos emisivos, coherente con el Bloom 3D.
- **Bordes sutiles** en dark mode: `1px solid rgb(255 255 255 / 0.08)`
  define superficies mejor que sombras.

## Anti-patrones (la lista negra)

- Morado/violeta sobre degradado azul-rosa genérico de "web IA".
- Emoji como sistema de iconos (usa Lucide, Phosphor o Heroicons).
- Tres cards idénticas con icono-título-párrafo repetidas en cada sección.
- Sombras `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` por defecto en todo.
- Titulares tímidos (32 px) con párrafos enormes.
- Animar `width/height/top/left` (usa `transform` y `opacity` — GPU).
- Centrar absolutamente todo el contenido de todas las secciones.

## Accesibilidad express

- Foco visible custom (`:focus-visible` con outline del acento).
- El canvas 3D es decorativo: `aria-hidden="true"`, y el contenido clave
  vive en HTML real, nunca solo dentro del WebGL.
- Semántica: un `h1`, jerarquía de headings sin saltos, `<nav>`, `<main>`,
  botones que son `<button>` y enlaces que son `<a>`.
