import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, CheckCircle2, MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import onixAzul from "@/assets/vehicles/onix-azul-2022.jpeg";
import hb20Prata from "@/assets/vehicles/hb20-prata-2024.png";
import argo2026 from "@/assets/vehicles/argo-2026.jpeg";
import basaltBranco from "@/assets/vehicles/basalt-branco-2024.jpeg";
import kicksPreto from "@/assets/vehicles/kicks-preto-2024.png";
import kicksPrata from "@/assets/vehicles/kicks-prata-2024.png";
import onixPrata from "@/assets/vehicles/onix-prata-2019.jpeg";
import prismaPreto from "@/assets/vehicles/prisma-preto-2019.jpeg";
import kiabongo from "@/assets/vehicles/kiabongo-2020.png";

const PHONE = "(11) 91913-4094";
const PHONE_TEL = "+5511919134094";
const WHATSAPP_URL =
  "https://wa.me/5511919134094?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20aluguel%20de%20carros.";

const apps = [
  { name: "Uber", url: "https://www.olilocacao.com.br/assets/uber-D4Kjs_ku.png" },
  { name: "99", url: "https://www.olilocacao.com.br/assets/99-C5YjFWE8.png" },
  { name: "InDrive", url: "https://www.olilocacao.com.br/assets/indrive-D4tT5kSm.png" },
  { name: "iFood", url: "https://www.olilocacao.com.br/assets/ifood-DlAWmDh_.png" },
  { name: "Rappi", url: "https://www.olilocacao.com.br/assets/rappi-D6lz69GM.png" },
  { name: "Loggi", url: "https://www.olilocacao.com.br/assets/loggi-C5nNdT7u.png" },
  { name: "Mercado Livre", url: "https://www.olilocacao.com.br/assets/mercado-livre-7WPQhpiU.png" },
  { name: "Shopee", url: "https://www.olilocacao.com.br/assets/shopee-Bp8FwSVx.png" },
];

const cars = [
  { name: "Nissan Kicks Preto", year: 2024, week: 1200, daily: 300, deposit: 3000, image: kicksPreto, available: true },
  { name: "Nissan Kicks Prata", year: 2024, week: 1200, daily: 300, deposit: 3000, image: kicksPrata, available: true },
  { name: "Hyundai HB20 Prata", year: 2024, week: 900, daily: 200, deposit: 2000, image: hb20Prata, available: false },
  { name: "Chevrolet Onix Prata", year: 2019, week: 800, daily: 200, deposit: 2000, image: onixPrata, available: false },
  { name: "Fiat Argo", year: 2026, week: 900, daily: 200, deposit: 2000, image: argo2026, available: false },
  { name: "Chevrolet Onix Azul Sedan", year: 2022, week: 900, daily: 200, deposit: 2000, image: onixAzul, available: true },
  { name: "Chevrolet Basalt Branco", year: 2024, week: 1200, daily: 300, deposit: 3000, image: basaltBranco, available: false },
  { name: "Chevrolet Prisma Preto", year: 2019, week: 800, daily: 200, deposit: 2000, image: prismaPreto, available: true },
  { name: "Kia Bongo Refrigerado", year: 2020, week: 1500, daily: 500, deposit: 5000, image: kiabongo, available: true },
];

const steps = [
  { n: 1, title: "Cadastro", text: "Envie seus dados básicos pelo WhatsApp ou formulário." },
  { n: 2, title: "Aprovação & Documentos", text: "Análise rápida e envio do contrato digital." },
  { n: 3, title: "Pagamento", text: "1ª semana + caução (com opção de parcelar)." },
  { n: 4, title: "Retirada", text: "Vistoria, chaves na mão e pronto para rodar nos apps." },
];

const faqs = [
  { q: "Qual a duração mínima do contrato para motoristas de aplicativo?", a: "O contrato mínimo é semanal. Você pode renovar conforme sua necessidade, sem fidelidade." },
  { q: "Como funciona a caução?", a: "A caução é paga apenas no cartão de crédito e pode ser parcelada. O valor é devolvido ao final do contrato, mediante vistoria." },
  { q: "Quais apps posso usar?", a: "Uber, 99, InDrive, iFood, Rappi, Loggi, Mercado Livre, Shopee e demais aplicativos de mobilidade e entrega." },
  { q: "Há limite de quilometragem?", a: "Não trabalhamos com limite de quilometragem para motoristas de aplicativo." },
  { q: "O seguro está incluído?", a: "Os veículos contam com proteção. Detalhes e franquias são apresentados no contrato digital." },
  { q: "Como funcionam as manutenções e revisões?", a: "Manutenções preventivas são por nossa conta, conforme cronograma do veículo." },
  { q: "O que acontece em caso de atraso no pagamento?", a: "Entre em contato imediatamente. Após o prazo, o veículo pode ser bloqueado e há cobrança de multa contratual." },
  { q: "Posso ter um veículo reserva durante manutenção?", a: "Sim, sujeito à disponibilidade da frota no momento da manutenção." },
  { q: "Como funciona a devolução do veículo?", a: "Agendamento prévio, vistoria de devolução e liberação da caução em até alguns dias úteis." },
  { q: "Quais documentos preciso apresentar?", a: "CNH categoria B válida, comprovante de residência e dados pessoais para o contrato digital." },
  { q: "Posso comprar o carro depois?", a: "Sim. Após 1 ano de aluguel, você tem direito de compra do veículo, com condições especiais." },
];

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#como-alugar", label: "Como Alugar" },
  { href: "#carros", label: "Carros" },
  { href: "#contato", label: "Contato" },
];

export default function Home() {
  const [form, setForm] = useState({ name: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá, meu nome é ${form.name}. ${form.message}`;
    window.open(`https://wa.me/5511919134094?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#inicio" className="text-xl font-bold tracking-wide text-primary">
            OLI LOCAÇÃO
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE_TEL}`} className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary">
              <Phone className="w-4 h-4 text-accent" />
              {PHONE}
            </a>
            <a href="#contato">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                Fale com um Consultor
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-primary text-primary-foreground"
      >
        <div
          className="absolute inset-0 opacity-10 bg-no-repeat bg-right bg-contain pointer-events-none"
          style={{
            backgroundImage:
              "url('https://www.olilocacao.com.br/assets/hero-car-DiVcQNNS.png')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Aluguel de carro para motorista de app{" "}
              <span className="text-accent">ou por diária.</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/85 max-w-xl">
              Planos semanais, caução facilitada e retirada rápida. Atendemos por WhatsApp.
            </p>

            <ul className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl">
              {[
                "Aprovação rápida",
                "Caução facilitada",
                "Pronto para Uber/99/InDrive",
                "Diária a partir de R$ 119,00",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-primary-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#contato">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 h-12">
                  Fale com um Consultor
                </Button>
              </a>
              <a href="#carros">
                <Button variant="outline" className="rounded-full px-6 h-12 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  Ver Carros
                </Button>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <Button variant="outline" className="rounded-full px-6 h-12 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  Quero por Diária
                </Button>
              </a>
              <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-accent ml-1">
                <Phone className="w-4 h-4" /> {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Apps strip */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl lg:text-3xl font-bold text-foreground">
            Compatível com os principais apps de mobilidade e entrega
          </h2>
          <div className="mt-10 grid grid-cols-4 md:grid-cols-8 gap-6 items-center">
            {apps.map((app) => (
              <div key={app.name} className="flex items-center justify-center h-16">
                <img src={app.url} alt={app.name} className="max-h-12 max-w-full object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Alugar */}
      <section id="como-alugar" className="py-16 lg:py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Como Alugar</h2>
            <p className="mt-3 text-muted-foreground">Processo simples e rápido em 4 passos</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12">
                Alugar Agora
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Aluguel por dia */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]">
            <img
              src="https://www.olilocacao.com.br/assets/daily-rental-keys-CCDeloML.jpg"
              alt="Chaves de carro sobre balcão de locadora"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Aluguel por dia, sem complicação: condições claras e retirada ágil.
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                ["Retirada rápida", "Ideal para compromissos, serviços e viagens curtas"],
                ["Pagamento facilitado", "Sem fidelidade"],
                ["Direito de compra do veículo após 1 ano de aluguel", ""],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{t}</p>
                    {d && <p className="text-sm text-muted-foreground">{d}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              <strong className="text-foreground">Documentos obrigatórios:</strong> CNH categoria B válida e dados pessoais para o contrato digital.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 h-12">
                  <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
                </Button>
              </a>
              <a href="#carros">
                <Button variant="outline" className="rounded-full px-6 h-12">
                  Ver carros
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Carros */}
      <section id="carros" className="py-16 lg:py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Carros Disponíveis</h2>
            <p className="mt-3 text-muted-foreground">
              Escolha o veículo ideal para você começar a trabalhar
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((c) => (
              <article
                key={c.name}
                className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow"
              >
                <div className="relative h-52 bg-muted">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                  <Badge
                    className={
                      "absolute top-3 right-3 " +
                      (c.available
                        ? "bg-success text-success-foreground hover:bg-success"
                        : "bg-muted text-muted-foreground hover:bg-muted")
                    }
                  >
                    {c.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">Ano {c.year}</p>

                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Semana</dt>
                      <dd className="font-semibold text-foreground">R$ {c.week.toLocaleString("pt-BR")}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Diária</dt>
                      <dd className="font-semibold text-foreground">R$ {c.daily.toLocaleString("pt-BR")}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Caução</dt>
                      <dd className="font-semibold text-foreground">R$ {c.deposit.toLocaleString("pt-BR")}</dd>
                    </div>
                  </dl>

                  <a
                    href={`https://wa.me/5511919134094?text=${encodeURIComponent(
                      `Olá, gostaria de informações sobre o ${c.name} ${c.year}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 block"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                      Quero este carro
                    </Button>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Dúvidas Frequentes</h2>
            <p className="mt-3 text-muted-foreground">Respostas para as perguntas mais comuns</p>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold">Entre em Contato</h2>
            <p className="mt-3 text-primary-foreground/85">Estamos prontos para atender você</p>
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-10">
            <form onSubmit={handleSubmit} className="bg-card text-foreground rounded-2xl p-6 lg:p-8 space-y-4 shadow-[var(--shadow-elevated)]">
              <h3 className="text-xl font-semibold">Envie uma mensagem</h3>
              <div>
                <label className="text-sm font-medium" htmlFor="name">Nome *</label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="message">Mensagem *</label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1"
                  placeholder="Como podemos ajudar?"
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12">
                Enviar Mensagem
              </Button>
            </form>

            <div className="space-y-5">
              {[
                { icon: Phone, label: "Telefone", value: PHONE, href: `tel:${PHONE_TEL}` },
                { icon: Mail, label: "E-mail", value: "olilocacao@outlook.com", href: "mailto:olilocacao@outlook.com" },
                { icon: Clock, label: "Horário", value: "Segunda a Segunda, 9h-18h" },
                { icon: MapPin, label: "Endereço", value: "R. José Silvestre da Cruz, 3 - Vila Ernesto, São Paulo - SP, 05778-220" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-primary-foreground/5 rounded-xl p-5 border border-primary-foreground/10">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/70">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-medium hover:text-accent break-words">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12">
                  <MessageCircle className="w-4 h-4 mr-2" /> Fale no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p>© Oli Locação. Todos os direitos reservados.</p>
            <p className="mt-1">CNPJ: 57.448.288/0001-89</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link to="/politica-de-privacidade" className="hover:text-primary">Política de Privacidade</Link>
            <Link to="/termos-de-uso" className="hover:text-primary">Termos de Uso</Link>
            <Link to="/auth" className="hover:text-primary">Área do Cliente</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
