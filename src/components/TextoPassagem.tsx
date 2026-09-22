type Modo = "almeida" | "parafrase" | "ambos";

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
  const principal = modo === "parafrase" ? parafrase : almeida;

  return (
    <figure className="rounded-xl border border-border bg-bg-elevated p-6">
      <blockquote className="font-serif text-xl leading-relaxed sm:text-2xl">“{principal}”</blockquote>
      <figcaption className="mt-3 text-sm text-fg-muted">{referencia}</figcaption>
      {modo === "ambos" && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs uppercase tracking-wide text-accent">Em outras palavras</p>
          <p className="mt-1 leading-relaxed text-fg-muted">{parafrase}</p>
        </div>
      )}
    </figure>
  );
}
