import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Link from "next/link";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nome, template: `%s | ${SITE.nome}` },
  description: SITE.descricao,
  openGraph: { type: "website", locale: "pt_BR", siteName: SITE.nome },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-serif text-lg font-semibold">
              {SITE.nome}
            </Link>
            <div className="flex gap-4 text-sm text-fg-muted">
              <Link href="/proverbios" className="hover:text-fg">Todos</Link>
              <Link href="/capitulos" className="hover:text-fg">Capítulos</Link>
              <Link href="/premium" className="font-medium text-accent">Premium</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-6 text-xs text-fg-muted">
            Texto bíblico: tradução João Ferreira de Almeida, domínio público.
            Interpretações e dicas são conteúdo original deste site.
          </div>
        </footer>
      </body>
    </html>
  );
}
