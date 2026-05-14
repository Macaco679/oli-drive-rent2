import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5511919134094";
const WHATSAPP_TEXT = encodeURIComponent("Olá, Gostaria de mais informações sobre o carro dos site.");

export const Header = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">OLI LOCAÇÃO</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => handleScroll("inicio")}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => handleScroll("como-alugar")}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Como Alugar
            </button>
            <button
              onClick={() => handleScroll("carros")}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Carros
            </button>
            <button
              onClick={() => handleScroll("contato")}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Contato
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:+5511919134094"
            className="hidden sm:flex items-center gap-2 text-sm font-medium"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span>(11) 91913-4094</span>
          </a>
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale com um Consultor
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
