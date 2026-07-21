"use client";

import { useEffect } from "react";

/** Registra el service worker (solo navegadores compatibles; localhost cuenta como seguro). */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* sin SW no pasa nada: la app funciona igual, solo pierde offline */
      });
    }
  }, []);
  return null;
}
