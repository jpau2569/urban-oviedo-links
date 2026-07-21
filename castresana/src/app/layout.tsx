import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Castresana", template: "%s · Castresana" },
  description:
    "Castresana — asesoría inmobiliaria premium en Oviedo. Portales privados para clientes y propietarios.",
  robots: { index: false, follow: false }, // portales privados: nunca indexar
};

export const viewport: Viewport = {
  themeColor: "#191512",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
