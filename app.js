/* =========================================================
   URBAN OVIEDO STORE — Lógica v2
   Datos → render → utilidades (abierto ahora, copiar, compartir, instalar, PWA)
   Todo el contenido editable vive en CONFIG.
   ========================================================= */

"use strict";

const CONFIG = {
  phone: "34696641381",
  waText: "Hola! Vengo del enlace de la tienda 👋",
  email: "urbanoviedostore@gmail.com",
  web: "https://urbanoviedostore.es/",
  instagram: "https://www.instagram.com/urbanstoreoviedo/",
  tiktok: "https://www.tiktok.com/@urbanstoreoviedo",
  maps: "https://www.google.com/maps/search/?api=1&query=Urban+Oviedo+Store+Calle+Nueve+de+Mayo+15+Oviedo",
  address: "C/ Nueve de Mayo 15, Oviedo",

  // Horario comercial (24h). Ajusta si cambia. day: 0=domingo … 6=sábado.
  // Cada día es una lista de tramos [inicio, fin] en minutos desde medianoche.
  hours: {
    1: [["10:30", "13:30"], ["17:00", "20:30"]], // Lunes
    2: [["10:30", "13:30"], ["17:00", "20:30"]],
    3: [["10:30", "13:30"], ["17:00", "20:30"]],
    4: [["10:30", "13:30"], ["17:00", "20:30"]],
    5: [["10:30", "13:30"], ["17:00", "20:30"]],
    6: [["11:00", "14:00"], ["17:00", "20:30"]], // Sábado
    0: [] // Domingo cerrado
  },

  brands: ["Antony Morato", "Karl Lagerfeld", "My Brand", "Dsquared2", "Savage"],

  reviews: [
    {
      author: "Francisco Díaz",
      color: "#ff6a00",
      when: "Hace 9 meses",
      text: "Mi tienda de ropa de moda favorita, trato fabuloso, marcas de ropa muy top, pedidos a Madrid en un día, atención de 10, siempre pendiente a cualquier duda, sitio ideal para comprar. Recomendado 100%."
    },
    {
      author: "Angel Torres Romero",
      color: "#4285F4",
      when: "Hace 1 año",
      text: "Tienda de ropa con las mejores marcas de moda de últimas tendencias como Antonio Morato, Karl Lagerfeld, My Brand, Dsquared2, y su marca propia Savage."
    },
    {
      author: "Guillermo Leon Brufau",
      color: "#34A853",
      when: "Hace 7 meses",
      text: "La tienda está muy bien, incluso las compras de ropa por internet. Te orientan con las tallas y son muy amables, en caso de tener que realizar un cambio ellos se ocupan de gestionarlo."
    }
  ]
};

/* ---------- Iconos SVG reutilizables ---------- */
const ICON = {
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.6 15.06L2 22l5.06-1.33A10 10 0 1 0 12 2z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="#FBBC04" stroke="#FBBC04" stroke-width="1" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  install: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  google: '<svg viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC04" d="M11.69 28.18A13.98 13.98 0 0 1 10.94 24c0-1.45.25-2.86.75-4.18v-5.7H4.34A22 22 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z"/></svg>'
};

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}) => Object.assign(document.createElement(tag), attrs);
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const waLink = () => `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(CONFIG.waText)}`;

/* ---------- Estado de apertura ---------- */
function openState(now = new Date()) {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const slots = CONFIG.hours[day] || [];

  for (const [start, end] of slots) {
    if (mins >= toMinutes(start) && mins < toMinutes(end)) {
      return { open: true, label: "Abierto ahora", detail: `Cierra a las ${end}` };
    }
  }
  // Próxima apertura hoy
  const next = slots.map(([s]) => s).find((s) => toMinutes(s) > mins);
  if (next) return { open: false, label: "Cerrado", detail: `Abre a las ${next}` };
  return { open: false, label: "Cerrado", detail: "Consulta horarios" };
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 1900);
}

async function copyToClipboard(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`${label} copiado`);
  } catch {
    toast("No se pudo copiar");
  }
}

/* ---------- Render ---------- */
function renderStatus() {
  const state = openState();
  $("#open-chip").className = `chip ${state.open ? "chip--open" : "chip--closed"}`;
  $("#open-chip").innerHTML = `<span class="dot"></span> ${state.label} · ${state.detail}`;
}

function renderPrimary() {
  $("#action-shop").href = CONFIG.web;
  $("#action-shop").innerHTML = `${ICON.web}<span>Tienda online</span><small>Comprar ahora</small>`;
  $("#action-wa").href = waLink();
  $("#action-wa").innerHTML = `${ICON.wa}<span>WhatsApp</span><small>Respuesta rápida</small>`;
}

function renderBrands() {
  $("#brand-list").innerHTML = CONFIG.brands.map((b) => `<li>${b}</li>`).join("");
}

function renderLinks() {
  const links = [
    { icon: ICON.instagram, title: "Instagram", sub: "@urbanstoreoviedo", href: CONFIG.instagram },
    { icon: ICON.tiktok, title: "TikTok", sub: "@urbanstoreoviedo", href: CONFIG.tiktok },
    { icon: ICON.map, title: "Cómo llegar", sub: CONFIG.address, href: CONFIG.maps },
    { icon: ICON.email, title: "Email", sub: CONFIG.email, href: `mailto:${CONFIG.email}` }
  ];

  $("#link-list").innerHTML = links
    .map(
      (l) => `<a class="link" href="${l.href}" target="_blank" rel="noopener">
        <span class="icon">${l.icon}</span>
        <span class="label"><strong>${l.title}</strong><small>${l.sub}</small></span>
        <span class="arrow">›</span>
      </a>`
    )
    .join("");
}

function renderReviewCta() {
  $("#review-cta").href = CONFIG.maps;
  $("#review-cta").innerHTML = `<span class="icon">${ICON.star}</span>
    <span class="label"><strong>Déjanos tu reseña</strong><small>Ayúdanos con 5★ en Google</small></span>
    <span class="arrow">›</span>`;
}

function renderReviews() {
  $("#reviews-count").innerHTML = `${ICON.google} 5,0 · ${CONFIG.reviews.length} reseñas`;
  $("#review-list").innerHTML = CONFIG.reviews
    .map(
      (r, i) => `<article class="review-card" style="animation-delay:${i * 0.08}s">
        <div class="review-top">
          <div class="avatar" style="background:${r.color}">${r.author[0]}</div>
          <div class="review-who">
            <div class="review-author">${r.author}</div>
            <div class="review-meta"><span class="stars">★★★★★</span> · ${r.when}</div>
          </div>
          <span class="g-logo">${ICON.google}</span>
        </div>
        <p class="review-text">${r.text}</p>
      </article>`
    )
    .join("");
}

/* ---------- Acciones utilitarias ---------- */
function setupUtilities() {
  const shareBtn = $("#btn-share");
  shareBtn.innerHTML = `${ICON.share} Compartir`;
  shareBtn.addEventListener("click", async () => {
    const data = { title: "Urban Oviedo Store", text: "Ropa urbana en Oviedo", url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelado */ }
    } else {
      copyToClipboard(location.href, "Enlace");
    }
  });

  const copyBtn = $("#btn-copy");
  copyBtn.innerHTML = `${ICON.copy} Dirección`;
  copyBtn.addEventListener("click", () => copyToClipboard(CONFIG.address, "Dirección"));
}

/* ---------- Instalación PWA ---------- */
function setupInstall() {
  const installBtn = $("#btn-install");
  let deferred = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    installBtn.hidden = false;
    installBtn.innerHTML = `${ICON.install} Instalar app`;
  });

  installBtn.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") toast("¡Instalada! 🎉");
    deferred = null;
    installBtn.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installBtn.hidden = true;
    toast("¡Gracias por instalarla!");
  });
}

/* ---------- Service Worker ---------- */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      /* Offline no disponible en este contexto (p. ej. file://). */
    });
  });
}

/* ---------- Init ---------- */
function init() {
  renderStatus();
  renderPrimary();
  renderBrands();
  renderLinks();
  renderReviewCta();
  renderReviews();
  setupUtilities();
  setupInstall();
  registerServiceWorker();

  // Refresca el estado de apertura cada minuto sin recargar.
  setInterval(renderStatus, 60000);
}

document.addEventListener("DOMContentLoaded", init);
