import Link from "next/link";
import { CartaoEntrada } from "@/components/CartaoEntrada";
import { ChamadaPremium } from "@/components/ChamadaPremium";
import { TextoPassagem } from "@/components/TextoPassagem";
import { entradaDoDia, lerEntradas } from "@/lib/conteudo";
import { SITE } from "@/lib/site";
import { TEMAS } from "@/lib/tipos";

// Recalcula a "entrada do dia" a cada hora sem rebuild.
export const revalidate = 3600;

export default function Inicio() {
  const hoje = entradaDoDia();
  const recentes = lerEntradas().slice(0, 6);

  return (
    <div className="space-y-12">
      <section>
        <p className="text-sm uppercase tracking-wide text-accent">Provérbio de hoje</p>
        {hoje ? (
          <>
            <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{hoje.titulo}</h1>
            <div className="mt-6">
              <TextoPassagem
                almeida={hoje.textoAlmeida}
                parafrase={hoje.parafrase}
                referencia={hoje.referencia}
                modo={SITE.textoModo}
              />
            </div>
            <p className="mt-4 leading-relaxed text-fg-muted">{hoje.interpretacao[0]}</p>
            <Link
              href={`/proverbios/${hoje.slug}`}
              className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg"
            >
              Ler interpretação e dicas
            </Link>
          </>
        ) : (
          <p>Conteúdo em preparação.</p>
        )}
      </section>

      <ChamadaPremium />

      <section>
        <h2 className="font-serif text-2xl font-semibold">Por tema</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(TEMAS).map(([chave, nome]) => (
            <Link
              key={chave}
              href={`/temas/${chave}`}
              className="rounded-full border border-border px-3 py-1 text-sm hover:border-accent"
            >
              {nome}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-semibold">Ensinamentos</h2>
          <Link href="/proverbios" className="text-sm text-accent">Ver todos</Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {recentes.map((e) => (
            <CartaoEntrada key={e.slug} entrada={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
