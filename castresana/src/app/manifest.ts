import type { MetadataRoute } from "next";
import { OS_DESCRIPTOR, OS_NAME } from "@/lib/os/modules";

/** Manifest PWA de Castresana OS (servido en /manifest.webmanifest). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: OS_NAME,
    short_name: "Castresana",
    description: OS_DESCRIPTOR,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#191512",
    theme_color: "#191512",
    lang: "es",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Resultados", url: "/analytics", description: "KPIs del mes" },
      { name: "Media Studio", url: "/media-studio", description: "Fábrica de contenido" },
      { name: "Torre de control", url: "/admin", description: "Salud y auditoría" },
    ],
  };
}
