# Fontes do conteúdo

## Texto bíblico

`texto-almeida.json` contém o livro de Provérbios (31 capítulos, 915 versículos)
na tradução de João Ferreira de Almeida, obtido do repositório público
`seven1m/open-bibles` (arquivo `por-almeida.usfx.xml`), onde consta como
**Domínio Público**. É a mesma base usada pela bible-api.com.

Antes do lançamento comercial: confirmar a edição exata (a grafia indica a
Almeida revisada de 1911, atualizada ortograficamente) e registrar aqui a
verificação.

Traduções que **não** podem ser usadas sem licença: NVI, NAA, ARA, ARC (SBB),
ACF (SBTB), NTLH, Bíblia King James em português.

## Entradas diárias

`entradas/*.json` são geradas por `scripts/gerar-entradas.ts` (Claude Opus 5)
e revisadas manualmente. Cada entrada traz o texto Almeida **e** uma paráfrase
própria; a interface mostra a Almeida em destaque e a paráfrase abaixo (`NEXT_PUBLIC_TEXTO_MODO=ambos`).

## Correções aplicadas ao texto-fonte

- Pv 13:11: "diminuira" -> "diminuirá" (acento ausente no arquivo original).
