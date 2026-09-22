import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartaoEntrada } from "@/components/CartaoEntrada";
import { entradasPorTema } from "@/lib/conteudo";
import { TEMAS, type Tema } from "@/lib/tipos";

type Props = { params: Promise<{ tema: string }> };

export function generateStaticParams() {
  return Object.keys(TEMAS).map((tema) => ({ tema }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tema } = await params;
  const nome = TEMAS[tema as Tema];
  if (!nome) return {};
  return {
    title: `Provérbios sobre ${nome.toLowerCase()}`,
    description: `O que os Provérbios de Salomão ensinam sobre ${nome.toLowerCase()}, com interpretação e dicas práticas.`,
  };
}

export default async function PaginaTema({ params }: Props) {
  const { tema } = await params;
  if (!(tema in TEMAS)) notFound();
  const nome = TEMAS[tema as Tema];
  const entradas = entradasPorTema(tema as Tema);
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Provérbios sobre {nome.toLowerCase()}</h1>
      <p className="mt-2 text-fg-muted">{entradas.length} ensinamentos.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {entradas.map((e) => (
          <CartaoEntrada key={e.slug} entrada={e} />
        ))}
      </div>
    </div>
  );
}
