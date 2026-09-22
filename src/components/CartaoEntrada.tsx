import Link from "next/link";
import type { Entrada } from "@/lib/tipos";
import { TEMAS } from "@/lib/tipos";

export function CartaoEntrada({ entrada }: { entrada: Entrada }) {
  return (
    <Link
      href={`/proverbios/${entrada.slug}`}
      className="block rounded-xl border border-border bg-bg-elevated p-5 transition hover:border-accent"
    >
      <div className="text-xs text-fg-muted">
        Dia {entrada.dia} · {entrada.referencia}
      </div>
      <h3 className="mt-1 font-serif text-lg font-semibold">{entrada.titulo}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{entrada.parafrase}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {entrada.temas.map((t) => (
          <span key={t} className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
            {TEMAS[t]}
          </span>
        ))}
      </div>
    </Link>
  );
}
