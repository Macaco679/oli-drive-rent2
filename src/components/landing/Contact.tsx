import { useState } from "react";
import { MessageSquare, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "5511919134094";
const WHATSAPP_TEXT = encodeURIComponent("Olá! Quero alugar um carro.");

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.name || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Criar mensagem para WhatsApp
    const whatsappMessage = `Olá, meu nome é ${formData.name}! ${formData.message}`;
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    toast({
      title: "Abrindo WhatsApp!",
      description: "Você será redirecionado para o WhatsApp.",
    });

    // Resetar formulário
    setFormData({
      name: "",
      message: "",
    });
  };

  return (
    <section id="contato" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-muted-foreground">
            Estamos prontos para atender você
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card p-6 md:p-8 rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Como podemos ajudar?"
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <a
                      href="tel:+5511919134094"
                      className="text-sm text-muted-foreground hover:text-primary"
                      aria-label="Ligar para (11) 91913-4094"
                    >
                      (11) 91913-4094
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <a
                      href="mailto:olilocacao@outlook.com"
                      className="text-sm text-muted-foreground hover:text-primary"
                      aria-label="Enviar e-mail para olilocacao@outlook.com"
                    >
                      olilocacao@outlook.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-sm text-muted-foreground">
                      Segunda a Segunda, 9h-18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">
                      R. José Silvestre da Cruz, 3 - Vila Ernesto, São Paulo - SP, 05778-220
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                  aria-label="Fale conosco pelo WhatsApp"
                >
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  Fale no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
