import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lerCapitulo, lerEntradas, lerTexto } from "@/lib/conteudo";

type Props = { params: Promise<{ numero: string }> };

export function generateStaticParams() {
  return lerTexto().map((c) => ({ numero: String(c.capitulo) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { numero } = await params;
  return {
    title: `Provérbios ${numero}`,
    description: `Capítulo ${numero} do livro de Provérbios, tradução Almeida, com links para os ensinamentos explicados.`,
  };
}

export default async function PaginaCapitulo({ params }: Props) {
  const { numero } = await params;
  const n = Number(numero);
  const cap = lerCapitulo(n);
  if (!cap) notFound();
  const entradasDoCapitulo = lerEntradas().filter((e) => e.capitulo === n);
  const explicados = new Map(
    entradasDoCapitulo.flatMap((e) =>
      Array.from({ length: e.versiculoFinal - e.versiculoInicial + 1 }, (_, i) => [
        e.versiculoInicial + i,
        e.slug,
      ]),
    ),
  );

  return (
    <article>
      <h1 className="font-serif text-3xl font-semibold">Provérbios {n}</h1>
      <nav className="mt-2 flex gap-4 text-sm text-accent">
        {n > 1 && <Link href={`/capitulos/${n - 1}`}>← Capítulo {n - 1}</Link>}
        {n < 31 && <Link href={`/capitulos/${n + 1}`}>Capítulo {n + 1} →</Link>}
      </nav>
      <div className="mt-6 space-y-3 font-serif text-lg leading-relaxed">
        {cap.versiculos.map((v) => {
          const slug = explicados.get(v.v);
          return (
            <p key={v.v} id={`v${v.v}`}>
              <sup className="mr-1 text-xs text-fg-muted">{v.v}</sup>
              {v.texto}
              {slug && (
                <Link href={`/proverbios/${slug}`} className="ml-2 text-sm text-accent">
                  ver explicação
                </Link>
              )}
            </p>
          );
        })}
      </div>
    </article>
  );
}
