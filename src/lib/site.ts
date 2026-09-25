export const SITE = {
  nome: "Provérbios de Salomão",
  slogan: "Um ensinamento por dia, com interpretação e passos práticos",
  descricao:
    "Os Provérbios de Salomão explicados em linguagem de hoje, com interpretação, dicas práticas e uma pergunta para reflexão. Um por dia, de graça.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** almeida | parafrase | ambos (Almeida em destaque, paráfrase abaixo) */
  textoModo: (process.env.NEXT_PUBLIC_TEXTO_MODO ?? "ambos") as
    | "almeida"
    | "parafrase"
    | "ambos",
  precoMensal: "R$ 14,90",
  precoAnual: "R$ 99",
};
