/**
 * Gera o conteúdo diário do app a partir do texto de Provérbios.
 *
 * Etapas:
 *   npx tsx scripts/gerar-entradas.ts plano      -> content/plano.json (segmenta os 31 capítulos em passagens e escolhe 365)
 *   npx tsx scripts/gerar-entradas.ts entradas   -> content/entradas/NNN.json (uma por passagem do plano)
 *
 * Opções:
 *   --limite N     gera no máximo N itens nesta execução (útil para testar com poucos)
 *   --capitulo N   restringe a etapa "plano" a um capítulo
 *
 * O script é retomável: pula o que já existe em disco. Exige ANTHROPIC_API_KEY.
 * Custo estimado (Opus 5, set/2026): plano ≈ US$ 3; 365 entradas ≈ US$ 25.
 */
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { CapituloTexto, Entrada, Tema } from "../src/lib/tipos";
import { TEMAS } from "../src/lib/tipos";

const MODELO = "claude-opus-5";
const RAIZ = path.join(process.cwd(), "content");
const ARQUIVO_PLANO = path.join(RAIZ, "plano.json");
const DIR_ENTRADAS = path.join(RAIZ, "entradas");
const TOTAL_DIAS = 365;

const client = new Anthropic();

const temasZod = z.enum(Object.keys(TEMAS) as [Tema, ...Tema[]]);

// ---------- Etapa 1: plano ----------

const PassagemZod = z.object({
  versiculoInicial: z.number().int(),
  versiculoFinal: z.number().int(),
  temas: z.array(temasZod).min(1).max(3),
  /** 1 = pouco autônomo/repetitivo, 5 = ensino forte e autossuficiente */
  forca: z.number().int().min(1).max(5),
  resumo: z.string(),
});
const PlanoCapituloZod = z.object({ passagens: z.array(PassagemZod) });

type PassagemPlano = z.infer<typeof PassagemZod> & { capitulo: number };

const SISTEMA_PLANO = `Você é um editor de conteúdo devocional em português do Brasil, especialista no livro de Provérbios.
Sua tarefa é dividir um capítulo em passagens curtas (1 a 4 versículos) que formem uma unidade de ensino completa.
Regras:
- Cubra o capítulo inteiro, sem sobreposição e sem pular versículos.
- Junte versículos que pertencem ao mesmo pensamento (paralelismos, listas, discursos).
- "forca" mede quanto a passagem se sustenta sozinha como ensino do dia: 5 para máximas memoráveis e aplicáveis, 1 para conectivos, repetições ou trechos que só fazem sentido no contexto maior.
- Escolha de 1 a 3 temas da lista fixa: ${Object.keys(TEMAS).join(", ")}.
- "resumo" é uma frase de até 15 palavras com o ensino central.`;

async function planejarCapitulo(cap: CapituloTexto): Promise<PassagemPlano[]> {
  const texto = cap.versiculos.map((v) => `${v.v}. ${v.texto}`).join("\n");
  const resposta = await client.messages.parse({
    model: MODELO,
    max_tokens: 16000,
    output_config: { effort: "high", format: zodOutputFormat(PlanoCapituloZod) },
    system: [{ type: "text", text: SISTEMA_PLANO, cache_control: { type: "ephemeral" } }],
    messages: [
      { role: "user", content: `Provérbios capítulo ${cap.capitulo}:\n\n${texto}` },
    ],
  });
  if (resposta.stop_reason === "refusal") {
    throw new Error(`Capítulo ${cap.capitulo}: pedido recusado (${resposta.stop_details?.category ?? "?"})`);
  }
  const parsed = resposta.parsed_output;
  if (!parsed) throw new Error(`Capítulo ${cap.capitulo}: resposta não estruturada`);
  const ultimo = cap.versiculos.at(-1)!.v;
  for (const p of parsed.passagens) {
    if (p.versiculoInicial < 1 || p.versiculoFinal > ultimo || p.versiculoFinal < p.versiculoInicial) {
      throw new Error(`Capítulo ${cap.capitulo}: passagem inválida ${p.versiculoInicial}-${p.versiculoFinal}`);
    }
  }
  return parsed.passagens.map((p) => ({ ...p, capitulo: cap.capitulo }));
}

/** Escolhe 365 passagens equilibrando temas e espalhando capítulos ao longo do ano. */
function escolher365(todas: PassagemPlano[]): PassagemPlano[] {
  const porTema = new Map<Tema, PassagemPlano[]>();
  for (const p of [...todas].sort((a, b) => b.forca - a.forca)) {
    const t = p.temas[0];
    if (!porTema.has(t)) porTema.set(t, []);
    porTema.get(t)!.push(p);
  }
  const escolhidas: PassagemPlano[] = [];
  const usadas = new Set<PassagemPlano>();
  const temas = [...porTema.keys()];
  let i = 0;
  while (escolhidas.length < Math.min(TOTAL_DIAS, todas.length)) {
    const fila = porTema.get(temas[i % temas.length])!;
    const proxima = fila.find((p) => !usadas.has(p));
    if (proxima) {
      usadas.add(proxima);
      escolhidas.push(proxima);
    }
    i++;
    if (i > todas.length * temas.length) break;
  }
  // Ordem determinística "embaralhada" para o calendário não seguir capítulo a capítulo.
  let semente = 20260101;
  const rand = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let j = escolhidas.length - 1; j > 0; j--) {
    const k = Math.floor(rand() * (j + 1));
    [escolhidas[j], escolhidas[k]] = [escolhidas[k], escolhidas[j]];
  }
  return escolhidas;
}

async function etapaPlano(opts: { limite?: number; capitulo?: number }) {
  const texto = JSON.parse(fs.readFileSync(path.join(RAIZ, "texto-almeida.json"), "utf8")) as CapituloTexto[];
  const parcialPath = path.join(RAIZ, "plano-parcial.json");
  const parcial: Record<number, PassagemPlano[]> = fs.existsSync(parcialPath)
    ? JSON.parse(fs.readFileSync(parcialPath, "utf8"))
    : {};
  let feitos = 0;
  for (const cap of texto) {
    if (opts.capitulo && cap.capitulo !== opts.capitulo) continue;
    if (parcial[cap.capitulo]) continue;
    if (opts.limite && feitos >= opts.limite) break;
    console.log(`Planejando capítulo ${cap.capitulo}...`);
    parcial[cap.capitulo] = await planejarCapitulo(cap);
    fs.writeFileSync(parcialPath, JSON.stringify(parcial, null, 2));
    feitos++;
  }
  const capitulosProntos = Object.keys(parcial).length;
  if (capitulosProntos < texto.length) {
    console.log(`Plano parcial: ${capitulosProntos}/${texto.length} capítulos. Rode de novo para continuar.`);
    return;
  }
  const todas = Object.values(parcial).flat();
  const escolhidas = escolher365(todas);
  fs.writeFileSync(ARQUIVO_PLANO, JSON.stringify(escolhidas, null, 2));
  console.log(`Plano completo: ${todas.length} passagens, ${escolhidas.length} escolhidas -> ${ARQUIVO_PLANO}`);
}

// ---------- Etapa 2: entradas ----------

const EntradaZod = z.object({
  titulo: z.string(),
  parafrase: z.string(),
  interpretacao: z.array(z.string()).min(2).max(4),
  dicas: z.array(z.string()).length(3),
  reflexao: z.string(),
});

const SISTEMA_ENTRADA = `Você escreve o conteúdo diário de um app de sabedoria prática baseado nos Provérbios de Salomão, em português do Brasil.
Público: adultos de 25 a 55 anos, cristãos ou simpatizantes, que querem aplicar o texto na vida real (trabalho, dinheiro, família, relacionamentos, emoções).
Tom: direto, caloroso, sem jargão religioso, sem moralismo e sem promessas de prosperidade. Nada de "Deus vai te abençoar financeiramente se...".
Campos:
- titulo: até 7 palavras, sem ponto final, com gancho concreto.
- parafrase: o mesmo ensino da passagem reescrito em linguagem atual, em 1 ou 2 frases, fiel ao sentido original, sem inventar conteúdo. É uma reescrita própria, não uma citação de tradução existente.
- interpretacao: 2 a 4 parágrafos curtos. O primeiro explica o que o texto dizia no contexto original (incluindo imagens, paralelismo hebraico e vocabulário como "temor do Senhor" quando aparecer). Os seguintes trazem o ensino para hoje, com um exemplo concreto de situação cotidiana.
- dicas: exatamente 3 ações que a pessoa consegue fazer hoje, cada uma começando com verbo no imperativo, com no máximo 25 palavras.
- reflexao: uma pergunta pessoal, em segunda pessoa, que a pessoa possa responder em um minuto.
Não cite outras passagens bíblicas fora de Provérbios. Não use markdown.`;

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function gerarEntrada(dia: number, p: PassagemPlano, cap: CapituloTexto): Promise<Entrada> {
  const textoCapitulo = cap.versiculos.map((v) => `${v.v}. ${v.texto}`).join("\n");
  const textoPassagem = cap.versiculos
    .filter((v) => v.v >= p.versiculoInicial && v.v <= p.versiculoFinal)
    .map((v) => v.texto)
    .join(" ");
  const fim = p.versiculoFinal > p.versiculoInicial ? `-${p.versiculoFinal}` : "";
  const referencia = `Provérbios ${p.capitulo}:${p.versiculoInicial}${fim}`;

  const resposta = await client.messages.parse({
    model: MODELO,
    max_tokens: 16000,
    output_config: { effort: "high", format: zodOutputFormat(EntradaZod) },
    system: [
      { type: "text", text: SISTEMA_ENTRADA },
      // O capítulo inteiro fica em cache: várias entradas do mesmo capítulo reaproveitam o prefixo.
      {
        type: "text",
        text: `Contexto (Provérbios ${p.capitulo} completo, tradução Almeida):\n${textoCapitulo}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Passagem do dia: ${referencia}\nTexto: ${textoPassagem}\nTemas: ${p.temas.join(", ")}\nEnsino central: ${p.resumo}`,
      },
    ],
  });
  if (resposta.stop_reason === "refusal") {
    throw new Error(`${referencia}: pedido recusado (${resposta.stop_details?.category ?? "?"})`);
  }
  const r = resposta.parsed_output;
  if (!r) throw new Error(`${referencia}: resposta não estruturada`);
  console.log(
    `  tokens: entrada ${resposta.usage.input_tokens}, cache lido ${resposta.usage.cache_read_input_tokens ?? 0}, saída ${resposta.usage.output_tokens}`,
  );
  return {
    dia,
    slug: `${slugify(r.titulo)}-pv-${p.capitulo}-${p.versiculoInicial}`,
    titulo: r.titulo,
    referencia,
    capitulo: p.capitulo,
    versiculoInicial: p.versiculoInicial,
    versiculoFinal: p.versiculoFinal,
    textoAlmeida: textoPassagem,
    parafrase: r.parafrase,
    temas: p.temas,
    interpretacao: r.interpretacao,
    dicas: r.dicas,
    reflexao: r.reflexao,
  };
}

async function etapaEntradas(opts: { limite?: number }) {
  if (!fs.existsSync(ARQUIVO_PLANO)) throw new Error("Rode a etapa 'plano' primeiro.");
  const plano = JSON.parse(fs.readFileSync(ARQUIVO_PLANO, "utf8")) as PassagemPlano[];
  const texto = JSON.parse(fs.readFileSync(path.join(RAIZ, "texto-almeida.json"), "utf8")) as CapituloTexto[];
  fs.mkdirSync(DIR_ENTRADAS, { recursive: true });
  let feitos = 0;
  for (let i = 0; i < plano.length; i++) {
    const dia = i + 1;
    const arquivo = path.join(DIR_ENTRADAS, `${String(dia).padStart(3, "0")}.json`);
    if (fs.existsSync(arquivo)) continue;
    if (opts.limite && feitos >= opts.limite) break;
    const p = plano[i];
    const cap = texto.find((c) => c.capitulo === p.capitulo)!;
    console.log(`Dia ${dia}: Provérbios ${p.capitulo}:${p.versiculoInicial}-${p.versiculoFinal}`);
    const entrada = await gerarEntrada(dia, p, cap);
    fs.writeFileSync(arquivo, JSON.stringify(entrada, null, 2) + "\n");
    feitos++;
  }
  const prontos = fs.readdirSync(DIR_ENTRADAS).filter((f) => f.endsWith(".json")).length;
  console.log(`Entradas em disco: ${prontos}/${plano.length}`);
}

// ---------- CLI ----------

function lerOpcao(nome: string): number | undefined {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 ? Number(process.argv[i + 1]) : undefined;
}

async function main() {
  const etapa = process.argv[2];
  const opts = { limite: lerOpcao("limite"), capitulo: lerOpcao("capitulo") };
  try {
    if (etapa === "plano") await etapaPlano(opts);
    else if (etapa === "entradas") await etapaEntradas(opts);
    else {
      console.error("Uso: tsx scripts/gerar-entradas.ts <plano|entradas> [--limite N] [--capitulo N]");
      process.exit(1);
    }
  } catch (erro) {
    if (erro instanceof Anthropic.AuthenticationError) {
      console.error("ANTHROPIC_API_KEY ausente ou inválida.");
    } else if (erro instanceof Anthropic.RateLimitError) {
      console.error("Limite de requisições atingido. Rode de novo em alguns minutos; o progresso foi salvo.");
    } else if (erro instanceof Anthropic.APIError) {
      console.error(`Erro da API (${erro.status}): ${erro.message}`);
    } else {
      console.error(erro);
    }
    process.exit(1);
  }
}

main();
