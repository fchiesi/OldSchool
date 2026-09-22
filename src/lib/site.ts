export const SITE = {
  nome: "Provérbios de Salomão",
  slogan: "Um ensinamento por dia, com interpretação e passos práticos",
  descricao:
    "Os Provérbios de Salomão explicados em linguagem de hoje, com interpretação, dicas práticas e uma pergunta para reflexão. Um por dia, de graça.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** almeida | parafrase | comparar */
  textoModo: (process.env.NEXT_PUBLIC_TEXTO_MODO ?? "comparar") as
    | "almeida"
    | "parafrase"
    | "comparar",
  precoMensal: "R$ 14,90",
  precoAnual: "R$ 99",
};
