import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import carOutline from "@/assets/car-outline.png";

const WHATSAPP_NUMBER = "5511919134094";
const WHATSAPP_TEXT = encodeURIComponent("Olá, Gostaria de mais informações sobre o carro dos site.");

export const Hero = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-hero-dark text-white"
      style={{
        backgroundImage: `url(${carOutline})`,
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-hero-dark/95" />
      
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Aluguel de carro para motorista de app{" "}
            <span className="text-primary">ou por diária.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Planos semanais, caução facilitada e retirada rápida. Atendemos por WhatsApp.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">Aprovação rápida</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">Caução facilitada</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">Pronto para Uber/99/InDrive</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">Diária a partir de R$ 119,00</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              onClick={() => handleScroll("contato")}
            >
              <a href="#contato">
                Fale com um Consultor
              </a>
            </Button>
            
            <Button
              size="lg"
              onClick={() => handleScroll("carros")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              Ver Carros
            </Button>

            <Button
              size="lg"
              onClick={() => handleScroll("diaria")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              Quero por Diária
            </Button>

            <a
              href="tel:+5511919134094"
              className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-primary transition-colors ml-0 sm:ml-4"
              aria-label="Ligar para (11) 91913-4094"
            >
              <Phone className="h-4 w-4" />
              <span>(11) 91913-4094</span>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
