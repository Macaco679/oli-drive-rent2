import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE = "+55 11 94017-5031";
const WHATSAPP_URL = "https://wa.me/5511940175031";

const LEGAL_PAGES = [
  { path: "/politica-de-privacidade", label: "Política de Privacidade", icon: ShieldCheck },
  { path: "/termos-de-uso", label: "Termos de Uso", icon: FileText },
];

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  toc: { id: string; label: string }[];
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, toc, children }: LegalLayoutProps) {
  const { pathname } = useLocation();
  const otherPage = LEGAL_PAGES.find((p) => p.path !== pathname) ?? LEGAL_PAGES[0];
  const OtherIcon = otherPage.icon;
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="text-xl font-bold tracking-wide text-primary">
            OLI LOCAÇÃO
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Início</Link>
            <Link to="/home#como-alugar" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Como Alugar</Link>
            <Link to="/home#carros" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Carros</Link>
            <Link to="/home#contato" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contato</Link>
          </nav>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
              Fale com um Consultor
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/home" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-accent text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar para o site
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{title}</h1>
          <p className="mt-4 text-lg text-primary-foreground/85 max-w-3xl">{subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[260px_1fr] gap-10">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Documentos legais
                </p>
                <nav className="space-y-1">
                  {LEGAL_PAGES.map((p) => {
                    const Icon = p.icon;
                    const active = p.path === pathname;
                    return (
                      <Link
                        key={p.path}
                        to={p.path}
                        className={`flex items-center gap-2 text-sm py-2 px-2 rounded-md transition-colors ${
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground/80 hover:text-primary hover:bg-secondary/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {p.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Índice
                </p>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm py-1.5 px-2 rounded-md text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Body */}
          <article className="bg-card rounded-2xl p-6 sm:p-10 border border-border/50 shadow-[var(--shadow-card)]">
            {/* Mobile cross-link */}
            <div className="lg:hidden mb-6 flex flex-wrap gap-2">
              {LEGAL_PAGES.map((p) => {
                const Icon = p.icon;
                const active = p.path === pathname;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className={`inline-flex items-center gap-2 text-sm py-2 px-3 rounded-full border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground/80 hover:text-primary hover:border-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {p.label}
                  </Link>
                );
              })}
            </div>

            <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:text-foreground prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-p:text-foreground/85 prose-p:leading-relaxed prose-li:text-foreground/85 prose-strong:text-foreground prose-a:text-primary">
              {children}
            </div>

            {/* Cross-page CTA */}
            <div className="mt-10 rounded-xl bg-primary/5 border border-primary/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                  Leia também
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground flex items-center gap-2">
                  <OtherIcon className="w-5 h-5 text-primary" /> {otherPage.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estes documentos se complementam. Recomendamos a leitura de ambos.
                </p>
              </div>
              <Link to={otherPage.path}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-11">
                  Ler {otherPage.label} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 rounded-xl bg-secondary/40 border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground">Precisa de ajuda?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fale com nosso time pelo WhatsApp para tirar dúvidas sobre estes termos.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-11">
                    <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
                  </Button>
                </a>
                <a href={`tel:${PHONE.replace(/\D/g, "")}`}>
                  <Button variant="outline" className="rounded-full h-11">
                    <Phone className="w-4 h-4 mr-2" /> {PHONE}
                  </Button>
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© Oli Locação. Todos os direitos reservados.</p>
          <p>CNPJ: 57.448.288/0001-89</p>
          <div className="flex gap-4">
            <Link to="/politica-de-privacidade" className="hover:text-primary">Política de Privacidade</Link>
            <Link to="/termos-de-uso" className="hover:text-primary">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
