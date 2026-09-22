export type Tema =
  | "sabedoria"
  | "financas"
  | "trabalho"
  | "familia"
  | "relacionamentos"
  | "palavras"
  | "emocoes"
  | "carater"
  | "fe"
  | "decisoes";

export const TEMAS: Record<Tema, string> = {
  sabedoria: "Sabedoria",
  financas: "Finanças",
  trabalho: "Trabalho",
  familia: "Família",
  relacionamentos: "Relacionamentos",
  palavras: "Palavras",
  emocoes: "Emoções",
  carater: "Caráter",
  fe: "Fé",
  decisoes: "Decisões",
};

export interface Passagem {
  capitulo: number;
  versiculoInicial: number;
  versiculoFinal: number;
}

export interface Entrada extends Passagem {
  /** Número sequencial 1..365 */
  dia: number;
  slug: string;
  titulo: string;
  /** Ex.: "Provérbios 3:5-6" */
  referencia: string;
  /** Texto bíblico em domínio público (Almeida) */
  textoAlmeida: string;
  /** Reescrita própria em linguagem atual */
  parafrase: string;
  temas: Tema[];
  /** Parágrafos da interpretação */
  interpretacao: string[];
  /** Três dicas práticas, acionáveis hoje */
  dicas: string[];
  /** Uma pergunta para reflexão */
  reflexao: string;
}

export interface CapituloTexto {
  capitulo: number;
  versiculos: { v: number; texto: string }[];
}
