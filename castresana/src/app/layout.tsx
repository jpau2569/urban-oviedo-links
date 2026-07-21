import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/os/PwaRegister";

export const metadata: Metadata = {
  title: { default: "Castresana OS", template: "%s · Castresana OS" },
  description:
    "Castresana OS — sistema operativo inmobiliario premium. Portales privados, Media Studio y gestión completa de la agencia.",
  robots: { index: false, follow: false }, // OS interno + portales privados: nunca indexar
  applicationName: "Castresana OS",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Castresana" },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#191512",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Compatibilidad con iOS antiguos (Next 15 solo emite el estándar moderno) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
