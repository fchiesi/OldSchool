import type { Metadata } from "next";
import Link from "next/link";
import { lerTexto } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Livro de Provérbios completo",
  description: "Os 31 capítulos do livro de Provérbios na tradução Almeida, em domínio público.",
};

export default function ListaCapitulos() {
  const capitulos = lerTexto();
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Livro de Provérbios</h1>
      <p className="mt-2 text-fg-muted">31 capítulos, tradução João Ferreira de Almeida.</p>
      <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-8">
        {capitulos.map((c) => (
          <Link
            key={c.capitulo}
            href={`/capitulos/${c.capitulo}`}
            className="rounded-lg border border-border py-3 text-center font-serif text-lg hover:border-accent"
          >
            {c.capitulo}
          </Link>
        ))}
      </div>
    </div>
  );
}
