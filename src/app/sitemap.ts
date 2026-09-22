import type { MetadataRoute } from "next";
import { lerEntradas, lerTexto } from "@/lib/conteudo";
import { SITE } from "@/lib/site";
import { TEMAS } from "@/lib/tipos";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/proverbios`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/capitulos`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/premium`, changeFrequency: "monthly", priority: 0.6 },
    ...lerEntradas().map((e) => ({
      url: `${base}/proverbios/${e.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...Object.keys(TEMAS).map((t) => ({
      url: `${base}/temas/${t}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...lerTexto().map((c) => ({
      url: `${base}/capitulos/${c.capitulo}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
