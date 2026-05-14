import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const WHATSAPP_NUMBER = "5511919134094";
const WHATSAPP_TEXT = encodeURIComponent("Olá, Gostaria de mais informações sobre o carro dos site.");

export const PriorityPurchase = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="max-w-5xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-lg border-2 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-8">
                <Award className="h-24 w-24 text-primary" />
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Fidelidade que dá vantagem
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Após 1 ano de contrato, o locatário tem exclusividade na opção de compra do veículo. 
                Fale com um consultor e conheça as condições.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quero saber mais
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
