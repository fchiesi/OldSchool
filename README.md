# Provérbios de Salomão

App web (PWA) com um ensinamento de Provérbios por dia: texto, interpretação,
três dicas práticas e uma pergunta para reflexão. Conteúdo gratuito e
indexável; área Premium (em construção) com leitura personalizada.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_SITE_URL e NEXT_PUBLIC_TEXTO_MODO
npm run dev
```

Scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Conteúdo

- `content/texto-almeida.json`: Provérbios completo, tradução Almeida (domínio público). Ver `content/FONTES.md`.
- `content/entradas/NNN.json`: entradas diárias. As sete primeiras foram escritas à mão como amostra.
- `content/plano.json`: gerado pela etapa `plano` (365 passagens escolhidas).

Geração das 365 entradas com Claude Opus 5 (exige `ANTHROPIC_API_KEY`):

```bash
npm run conteudo:plano                     # segmenta os 31 capítulos e escolhe 365 passagens
npm run conteudo:entradas -- --limite 5    # gera 5 para revisar o tom
npm run conteudo:entradas                  # gera o restante (retomável)
```

`NEXT_PUBLIC_TEXTO_MODO` controla o que aparece nas páginas: `almeida`,
`parafrase` ou `ambos` (padrão: Almeida em destaque, paráfrase abaixo).

## Estrutura

- `/` provérbio do dia (cicla pelas entradas existentes, fuso de São Paulo)
- `/proverbios` e `/proverbios/[slug]` ensinamentos (páginas estáticas, JSON-LD)
- `/temas/[tema]` filtro por tema
- `/capitulos/[n]` texto integral por capítulo com links para as explicações
- `/premium` página do plano pago
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`

## Roadmap

1. Fase 1 (esta): site estático, conteúdo base, SEO.
2. Fase 2: login (Supabase), assinatura (Stripe), onboarding de perfil, geração personalizada com cache.
3. Fase 3: e-mail diário, imagens para compartilhar, notificações.
4. Fase 4: empacotar para lojas só com tração comprovada.
