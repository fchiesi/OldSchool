import type { Metadata } from "next";
import { CartaoEntrada } from "@/components/CartaoEntrada";
import { lerEntradas } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Todos os ensinamentos",
  description: "Lista completa dos Provérbios de Salomão explicados, com interpretação e dicas práticas.",
};

export default function ListaProverbios() {
  const entradas = lerEntradas();
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Todos os ensinamentos</h1>
      <p className="mt-2 text-fg-muted">{entradas.length} ensinamentos publicados.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {entradas.map((e) => (
          <CartaoEntrada key={e.slug} entrada={e} />
        ))}
      </div>
    </div>
  );
}
