import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Premium",
  description: "Provérbios aplicados à sua vida: leitura personalizada diária e diagnóstico semanal.",
};

const BENEFICIOS = [
  ["Leitura personalizada", "Cada ensino do dia é cruzado com as áreas da sua vida que você indicou no início."],
  ["Diagnóstico semanal", "Um resumo de onde a sabedoria de Provérbios toca o que você está vivendo esta semana."],
  ["Histórico e favoritos", "Guarde o que marcou você e volte quando precisar."],
  ["Lembrete diário", "Por e-mail ou notificação, no horário que você escolher."],
];

export default function Premium() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Provérbios aplicados à sua vida</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">
          O conteúdo diário continua gratuito. O Premium responde a uma pergunta diferente:
          onde este ensino encosta no que você está vivendo agora.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {BENEFICIOS.map(([titulo, texto]) => (
          <li key={titulo} className="rounded-xl border border-border bg-bg-elevated p-5">
            <h2 className="font-serif text-lg font-semibold">{titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{texto}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-xl border border-accent/40 bg-accent-soft p-6 text-center">
        <p className="font-serif text-3xl font-semibold">{SITE.precoMensal}<span className="text-base font-normal text-fg-muted">/mês</span></p>
        <p className="mt-1 text-sm text-fg-muted">ou {SITE.precoAnual}/ano · 7 dias grátis</p>
        <button
          disabled
          className="mt-4 cursor-not-allowed rounded-lg bg-accent px-5 py-2 text-sm font-medium text-bg opacity-60"
        >
          Em breve
        </button>
        <p className="mt-3 text-xs text-fg-muted">Assinatura em preparação. O conteúdo gratuito já está disponível.</p>
      </section>
    </div>
  );
}
