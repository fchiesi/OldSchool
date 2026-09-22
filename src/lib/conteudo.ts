import fs from "node:fs";
import path from "node:path";
import type { CapituloTexto, Entrada, Passagem, Tema } from "./tipos";

const RAIZ = path.join(process.cwd(), "content");

let cacheTexto: CapituloTexto[] | null = null;
let cacheEntradas: Entrada[] | null = null;

export function lerTexto(): CapituloTexto[] {
  if (!cacheTexto) {
    cacheTexto = JSON.parse(
      fs.readFileSync(path.join(RAIZ, "texto-almeida.json"), "utf8"),
    ) as CapituloTexto[];
  }
  return cacheTexto;
}

export function lerCapitulo(n: number): CapituloTexto | undefined {
  return lerTexto().find((c) => c.capitulo === n);
}

export function textoDaPassagem(p: Passagem): string {
  const cap = lerCapitulo(p.capitulo);
  if (!cap) return "";
  return cap.versiculos
    .filter((v) => v.v >= p.versiculoInicial && v.v <= p.versiculoFinal)
    .map((v) => v.texto)
    .join(" ");
}

export function referencia(p: Passagem): string {
  const fim =
    p.versiculoFinal > p.versiculoInicial ? `-${p.versiculoFinal}` : "";
  return `Provérbios ${p.capitulo}:${p.versiculoInicial}${fim}`;
}

export function lerEntradas(): Entrada[] {
  if (!cacheEntradas) {
    const dir = path.join(RAIZ, "entradas");
    const arquivos = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
      : [];
    cacheEntradas = arquivos
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Entrada)
      .sort((a, b) => a.dia - b.dia);
  }
  return cacheEntradas;
}

export function entradaPorSlug(slug: string): Entrada | undefined {
  return lerEntradas().find((e) => e.slug === slug);
}

export function entradasPorTema(tema: Tema): Entrada[] {
  return lerEntradas().filter((e) => e.temas.includes(tema));
}

/** Dia do ano (1..366) no fuso de São Paulo. */
export function diaDoAno(data = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [ano, mes, dia] = fmt.format(data).split("-").map(Number);
  const inicio = Date.UTC(ano, 0, 1);
  const hoje = Date.UTC(ano, mes - 1, dia);
  return Math.floor((hoje - inicio) / 86_400_000) + 1;
}

/** Entrada do dia: percorre as entradas existentes em ciclo. */
export function entradaDoDia(data = new Date()): Entrada | undefined {
  const todas = lerEntradas();
  if (todas.length === 0) return undefined;
  return todas[(diaDoAno(data) - 1) % todas.length];
}

export function vizinhas(e: Entrada): { anterior?: Entrada; proxima?: Entrada } {
  const todas = lerEntradas();
  const i = todas.findIndex((x) => x.slug === e.slug);
  return { anterior: todas[i - 1], proxima: todas[i + 1] };
}
