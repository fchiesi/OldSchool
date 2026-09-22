"use client";

import { useState } from "react";

type Modo = "almeida" | "parafrase" | "comparar";

export function TextoPassagem({
  almeida,
  parafrase,
  referencia,
  modo,
}: {
  almeida: string;
  parafrase: string;
  referencia: string;
  modo: Modo;
}) {
  const [aba, setAba] = useState<"almeida" | "parafrase">("almeida");
  const mostrar = modo === "comparar" ? aba : modo;
  const texto = mostrar === "almeida" ? almeida : parafrase;

  return (
    <figure className="rounded-xl border border-border bg-bg-elevated p-6">
      {modo === "comparar" && (
        <div className="mb-4 flex gap-2 text-xs" role="tablist" aria-label="Versão do texto">
          {(["almeida", "parafrase"] as const).map((op) => (
            <button
              key={op}
              role="tab"
              aria-selected={aba === op}
              onClick={() => setAba(op)}
              className={`rounded-full px-3 py-1 transition ${
                aba === op ? "bg-accent text-bg" : "bg-accent-soft text-fg-muted hover:text-fg"
              }`}
            >
              {op === "almeida" ? "Almeida (domínio público)" : "Paráfrase própria"}
            </button>
          ))}
        </div>
      )}
      <blockquote className="font-serif text-xl leading-relaxed sm:text-2xl">“{texto}”</blockquote>
      <figcaption className="mt-3 text-sm text-fg-muted">{referencia}</figcaption>
    </figure>
  );
}
