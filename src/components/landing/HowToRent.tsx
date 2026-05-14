import { User, FileText, CreditCard, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const WHATSAPP_NUMBER = "5511919134094";
const WHATSAPP_TEXT = encodeURIComponent("Olá, Gostaria de mais informações sobre o carro dos site.");

const steps = [
  {
    icon: User,
    title: "1. Cadastro",
    description: "Envie seus dados básicos pelo WhatsApp ou formulário.",
  },
  {
    icon: FileText,
    title: "2. Aprovação & Documentos",
    description: "Análise rápida e envio do contrato digital.",
  },
  {
    icon: CreditCard,
    title: "3. Pagamento",
    description: "1ª semana + caução (com opção de parcelar).",
  },
  {
    icon: Key,
    title: "4. Retirada",
    description: "Vistoria, chaves na mão e pronto para rodar nos apps.",
  },
];

export const HowToRent = () => {
  return (
    <section id="como-alugar" className="py-20 pt-12 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Alugar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Processo simples e rápido em 4 passos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
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
              Alugar Agora
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
