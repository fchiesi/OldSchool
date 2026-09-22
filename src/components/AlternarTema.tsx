"use client";

import { useSyncExternalStore } from "react";

const CHAVE = "tema";
const EVENTO = "tema-alterado";

function lerClaro() {
  return document.documentElement.dataset.theme === "light";
}

function assinar(notificar: () => void) {
  window.addEventListener(EVENTO, notificar);
  return () => window.removeEventListener(EVENTO, notificar);
}

export function AlternarTema() {
  // No servidor o tema é sempre o escuro (padrão); no cliente lê o atributo já aplicado no <html>.
  const claro = useSyncExternalStore(assinar, lerClaro, () => false);

  function alternar() {
    if (claro) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = "light";
    try {
      localStorage.setItem(CHAVE, claro ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event(EVENTO));
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={claro ? "Usar tema escuro" : "Usar tema claro"}
      title={claro ? "Tema escuro" : "Tema claro"}
      className="rounded-full border border-border px-2 py-1 text-xs text-fg-muted hover:text-fg"
    >
      {claro ? "☾" : "☀"}
    </button>
  );
}
