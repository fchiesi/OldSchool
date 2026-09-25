import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.nome,
    short_name: "Provérbios",
    description: SITE.descricao,
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    background_color: "#17140f",
    theme_color: "#d9a86c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
