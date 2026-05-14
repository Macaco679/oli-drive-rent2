import { MessageSquare, Phone, Mail } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-hero-dark text-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">
              OLI LOCAÇÃO
            </h3>
            <p className="text-sm text-white/80">
              Aluguel de carros para motoristas de aplicativo e entregadores,
              sem burocracia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleScroll("inicio")}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("como-alugar")}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Como Alugar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("carros")}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Carros
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("contato")}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/5511919134094"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-primary transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="tel:+5511919134094"
                  className="flex items-center gap-2 text-white/80 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (11) 91913-4094
                </a>
              </li>
              <li>
                <a
                  href="mailto:olilocacao@outlook.com"
                  className="flex items-center gap-2 text-white/80 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  E-mail
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Informações</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>CNPJ: 57.448.288/0001-89</li>
              <li>R. José Silvestre da Cruz, 3</li>
              <li>Vila Ernesto, São Paulo - SP</li>
              <li>CEP: 05778-220</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>© {currentYear} Oli Locação. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
