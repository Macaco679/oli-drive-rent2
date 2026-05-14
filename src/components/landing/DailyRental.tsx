import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import dailyRentalImage from "@/assets/daily-rental-keys.jpg";

const WHATSAPP_NUMBER = "5511919134094";
const WHATSAPP_TEXT = encodeURIComponent("Olá, Gostaria de mais informações sobre o carro dos site.");

export const DailyRental = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="diaria" className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image Column */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={dailyRentalImage}
                alt="Chaves de carro sobre balcão de locadora"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Aluguel por dia, sem complicação: condições claras e retirada ágil.
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-foreground">Retirada rápida</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-foreground">Ideal para compromissos, serviços e viagens curtas</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-foreground">Pagamento facilitado</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-foreground">Sem fidelidade</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-foreground">Direito de compra do veículo após 1 ano de aluguel</span>
              </div>
            </div>

            <div className="bg-muted/50 border-l-4 border-primary p-4 rounded-r-lg mb-8">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Documentos obrigatórios:</strong> CNH categoria B válida 
                  e dados pessoais para o contrato digital.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar no WhatsApp sobre diária"
                >
                  Falar no WhatsApp
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleScroll("carros")}
              >
                Ver carros
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
