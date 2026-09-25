import Link from "next/link";
import { SITE } from "@/lib/site";

export function ChamadaPremium({ referencia }: { referencia?: string }) {
  return (
    <aside className="rounded-xl border border-accent/40 bg-accent-soft p-6">
      <h2 className="font-serif text-lg font-semibold">Para você, na sua vida</h2>
      <p className="mt-2 text-sm leading-relaxed">
        No Premium, {referencia ? `o ensino de ${referencia}` : "cada ensino do dia"} é cruzado com
        as áreas da sua vida que você indicou: finanças, trabalho, família, relacionamentos e
        emoções. Você recebe uma leitura personalizada e um diagnóstico semanal de onde a
        sabedoria de Provérbios toca o que você está vivendo.
      </p>
      <Link
        href="/premium"
        className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg"
      >
        Conhecer o Premium · {SITE.precoMensal}/mês
      </Link>
    </aside>
  );
}
