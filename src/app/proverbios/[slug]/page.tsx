import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChamadaPremium } from "@/components/ChamadaPremium";
import { TextoPassagem } from "@/components/TextoPassagem";
import { entradaPorSlug, lerEntradas, vizinhas } from "@/lib/conteudo";
import { SITE } from "@/lib/site";
import { TEMAS } from "@/lib/tipos";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return lerEntradas().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = entradaPorSlug(slug);
  if (!e) return {};
  return {
    title: `${e.titulo} (${e.referencia})`,
    description: `${e.referencia}: ${e.parafrase} Interpretação e três dicas práticas.`,
    alternates: { canonical: `/proverbios/${e.slug}` },
    openGraph: { title: e.titulo, description: e.parafrase, type: "article" },
  };
}

export default async function PaginaEntrada({ params }: Props) {
  const { slug } = await params;
  const e = entradaPorSlug(slug);
  if (!e) notFound();
  const { anterior, proxima } = vizinhas(e);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: e.titulo,
    description: e.parafrase,
    inLanguage: "pt-BR",
    about: e.referencia,
    keywords: e.temas.map((t) => TEMAS[t]).join(", "),
    mainEntityOfPage: `${SITE.url}/proverbios/${e.slug}`,
    publisher: { "@type": "Organization", name: SITE.nome },
  };

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <p className="text-sm text-fg-muted">
          Dia {e.dia} ·{" "}
          <Link href={`/capitulos/${e.capitulo}`} className="hover:text-accent">
            {e.referencia}
          </Link>
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{e.titulo}</h1>
        <div className="mt-3 flex flex-wrap gap-1">
          {e.temas.map((t) => (
            <Link
              key={t}
              href={`/temas/${t}`}
              className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent"
            >
              {TEMAS[t]}
            </Link>
          ))}
        </div>
      </header>

      <TextoPassagem
        almeida={e.textoAlmeida}
        parafrase={e.parafrase}
        referencia={e.referencia}
        modo={SITE.textoModo}
      />

      <section>
        <h2 className="font-serif text-2xl font-semibold">O que o texto ensina</h2>
        <div className="mt-3 space-y-4 leading-relaxed">
          {e.interpretacao.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold">Para fazer hoje</h2>
        <ol className="mt-3 space-y-3">
          {e.dicas.map((d, i) => (
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {i + 1}
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="text-sm uppercase tracking-wide text-accent">Para refletir</h2>
        <p className="mt-2 font-serif text-xl leading-relaxed">{e.reflexao}</p>
      </section>

      <ChamadaPremium referencia={e.referencia} />

      <nav className="flex justify-between border-t border-border pt-6 text-sm">
        {anterior ? (
          <Link href={`/proverbios/${anterior.slug}`} className="text-accent">
            ← {anterior.titulo}
          </Link>
        ) : <span />}
        {proxima ? (
          <Link href={`/proverbios/${proxima.slug}`} className="text-right text-accent">
            {proxima.titulo} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
