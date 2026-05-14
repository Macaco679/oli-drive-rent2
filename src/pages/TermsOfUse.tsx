import { WebLayout } from "@/components/layout/WebLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const sections = [
  { id: "definicoes", title: "1. Definições" },
  { id: "objeto", title: "2. Objeto" },
  { id: "informacoes", title: "3. Informações do site" },
  { id: "cadastro", title: "4. Cadastro, análise e aprovação" },
  { id: "reserva", title: "5. Reserva e disponibilidade" },
  { id: "caucao", title: "6. Caução, pagamentos e cobranças" },
  { id: "obrig-locatario", title: "7. Obrigações do locatário e condutor" },
  { id: "obrig-oli", title: "8. Obrigações da Oli Locação" },
  { id: "uso", title: "9. Uso do veículo" },
  { id: "multas", title: "10. Multas, avarias, sinistros" },
  { id: "rastreamento", title: "11. Rastreamento, bloqueio e recuperação" },
  { id: "devolucao", title: "12. Devolução do veículo" },
  { id: "cancelamento", title: "13. Cancelamento, suspensão ou rescisão" },
  { id: "limitacao", title: "14. Limitação de responsabilidade" },
  { id: "propriedade", title: "15. Propriedade intelectual" },
  { id: "dados", title: "16. Proteção de dados pessoais" },
  { id: "alteracoes", title: "17. Alterações dos Termos" },
  { id: "lei", title: "18. Lei aplicável e foro" },
  { id: "contato", title: "19. Contato" },
];

export default function TermsOfUse() {
  return (
    <WebLayout>
      <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Termos de Uso e Condições Gerais</h1>
          <p className="text-lg md:text-xl opacity-90">
            Regras que regem o uso do site e a contratação dos serviços da Oli Locação.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start">
          <Card className="p-4">
            <h2 className="font-semibold mb-3 text-primary">Índice</h2>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <Card className="p-6 md:p-10 space-y-8 leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            Estes Termos de Uso e Condições Gerais regulam o acesso ao site da Oli Locação, o uso dos
            canais de atendimento e as condições básicas aplicáveis às solicitações, propostas, reservas
            e contratações de locação de veículos.
          </p>
          <p className="text-muted-foreground">
            A Oli Locação é marca da <strong>OLI LOCACAO DE VEICULOS LTDA</strong>, inscrita no CNPJ
            nº <strong>57.448.288/0001-89</strong>, com sede na Rua José Silvestre da Cruz, nº 3,
            Parque Arariba, São Paulo/SP, CEP 05778-220.
          </p>
          <p className="text-muted-foreground">
            Ao acessar o site, solicitar atendimento, enviar documentos, realizar cadastro, reservar
            veículo ou contratar qualquer serviço, o usuário declara que leu, entendeu e concorda com
            estes Termos.
          </p>

          <section id="definicoes">
            <h2 className="text-2xl font-bold text-primary mb-3">1. Definições</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Oli Locação:</strong> OLI LOCACAO DE VEICULOS LTDA, locadora dos veículos.</li>
              <li><strong>Usuário:</strong> qualquer pessoa que acessa o site ou canais de atendimento.</li>
              <li><strong>Locatário:</strong> pessoa física ou jurídica que contrata a locação.</li>
              <li><strong>Condutor:</strong> pessoa autorizada a dirigir o veículo locado.</li>
              <li><strong>Caução:</strong> valor exigido como garantia da locação.</li>
              <li><strong>Contrato:</strong> instrumento específico de locação assinado entre as partes.</li>
            </ul>
          </section>

          <section id="objeto">
            <h2 className="text-2xl font-bold text-primary mb-3">2. Objeto</h2>
            <p>O site disponibiliza informações institucionais, canais de contato e ferramentas para
            cadastro e solicitação de locação de veículos. A efetiva contratação depende de processo
            específico, conforme estes Termos e o Contrato de Locação aplicável.</p>
          </section>

          <section id="informacoes">
            <h2 className="text-2xl font-bold text-primary mb-3">3. Informações do site</h2>
            <p>Imagens, valores, planos, descrições e disponibilidade apresentados no site são
            meramente ilustrativos e podem sofrer alterações sem aviso prévio. As condições do site
            podem mudar a qualquer tempo. Em caso de divergência, prevalecem as condições do Contrato
            de Locação específico firmado entre as partes.</p>
          </section>

          <section id="cadastro">
            <h2 className="text-2xl font-bold text-primary mb-3">4. Cadastro, análise e aprovação</h2>
            <p>A contratação <strong>não é automática pelo site</strong>. Toda locação depende de:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Aprovação cadastral e documental.</li>
              <li>Análise de crédito, risco e antifraude.</li>
              <li>Disponibilidade do veículo.</li>
              <li>Pagamento dos valores e da caução, quando aplicável.</li>
              <li>Assinatura do Contrato de Locação.</li>
              <li>Vistoria de retirada do veículo.</li>
            </ul>
            <p className="mt-2">A Oli Locação pode <strong>negar cadastro, cancelar proposta ou
            recusar locação</strong> em caso de risco, inconsistência documental, suspeita de fraude,
            inadimplência, descumprimento de regras ou indisponibilidade de veículo.</p>
          </section>

          <section id="reserva">
            <h2 className="text-2xl font-bold text-primary mb-3">5. Reserva e disponibilidade</h2>
            <p>Reservas estão sujeitas à disponibilidade da frota e à confirmação pela Oli Locação.
            A confirmação pode depender de pagamento prévio, sinal, caução e validação documental.</p>
          </section>

          <section id="caucao">
            <h2 className="text-2xl font-bold text-primary mb-3">6. Caução, pagamentos e cobranças</h2>
            <p>Para garantir a locação, poderá ser exigida caução em valor e modalidade definidos
            (cartão de crédito, PIX, transferência ou outra forma aceita). A caução pode ser utilizada
            para compensar débitos pendentes do locatário, incluindo multas, avarias, sinistros,
            franquias, combustível, limpeza especial, diárias adicionais e demais valores devidos.
            A devolução da caução depende da conferência do veículo, apuração de multas, avarias,
            sinistros e quaisquer pendências.</p>
          </section>

          <section id="obrig-locatario">
            <h2 className="text-2xl font-bold text-primary mb-3">7. Obrigações do locatário e do condutor</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fornecer informações verdadeiras, completas e atualizadas.</li>
              <li>Apresentar documentação válida (CNH, identidade, comprovantes).</li>
              <li>Realizar pagamentos nos prazos acordados.</li>
              <li>Usar o veículo com zelo, dentro da lei e conforme o Contrato.</li>
              <li>Comunicar imediatamente qualquer sinistro, avaria, furto ou roubo.</li>
              <li>Devolver o veículo no prazo, local e condições contratadas.</li>
            </ul>
          </section>

          <section id="obrig-oli">
            <h2 className="text-2xl font-bold text-primary mb-3">8. Obrigações da Oli Locação</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Disponibilizar veículo em condições adequadas de uso.</li>
              <li>Prestar atendimento pelos canais oficiais.</li>
              <li>Cumprir o Contrato de Locação e a legislação aplicável.</li>
              <li>Tratar dados pessoais conforme a Política de Privacidade e a LGPD.</li>
            </ul>
          </section>

          <section id="uso">
            <h2 className="text-2xl font-bold text-primary mb-3">9. Uso do veículo</h2>
            <p>É <strong>vedado</strong> ao locatário e ao condutor:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Sublocar, emprestar, vender, ceder ou transferir o veículo a terceiros.</li>
              <li>Permitir condução por pessoa não autorizada ou sem CNH válida.</li>
              <li>Desmontar, adulterar, remover ou inutilizar rastreador, telemetria ou equipamentos.</li>
              <li>Utilizar o veículo para atos ilícitos, transporte irregular, competição, off-road
              ou finalidades não previstas em Contrato.</li>
              <li>Conduzir sob efeito de álcool, substâncias entorpecentes ou em desacordo com a lei.</li>
              <li>Sair do território nacional sem autorização expressa por escrito.</li>
            </ul>
          </section>

          <section id="multas">
            <h2 className="text-2xl font-bold text-primary mb-3">10. Multas, avarias, sinistros e responsabilidades</h2>
            <p>O locatário é integralmente responsável por multas de trânsito, infrações
            administrativas, danos, avarias, mau uso, atrasos, combustível, limpeza especial,
            sinistros, franquias e coparticipações de seguro, guincho, pátio, apreensão, diárias
            adicionais e demais custos previstos em Contrato, ainda que apurados após a devolução do
            veículo.</p>
          </section>

          <section id="rastreamento">
            <h2 className="text-2xl font-bold text-primary mb-3">11. Rastreamento, bloqueio e recuperação do veículo</h2>
            <p>Os veículos podem possuir rastreador, telemetria e sistemas de segurança. Em caso de
            inadimplência, apropriação indevida, suspeita de fraude, descumprimento contratual,
            ausência de devolução ou risco ao patrimônio, a Oli Locação poderá adotar medidas para
            localização, bloqueio remoto, retomada do veículo, cobrança de valores e defesa de seus
            direitos, sempre respeitada a legislação aplicável.</p>
          </section>

          <section id="devolucao">
            <h2 className="text-2xl font-bold text-primary mb-3">12. Devolução do veículo</h2>
            <p>O veículo deve ser devolvido no prazo, local e horário acordados, nas mesmas condições
            de retirada, com tanque conforme contratado e acompanhado dos documentos e acessórios.
            Atrasos geram cobrança de diárias adicionais e demais encargos.</p>
          </section>

          <section id="cancelamento">
            <h2 className="text-2xl font-bold text-primary mb-3">13. Cancelamento, suspensão ou rescisão</h2>
            <p>A Oli Locação pode suspender ou rescindir a locação, com retomada do veículo, em caso
            de descumprimento contratual, inadimplência, fraude, uso indevido ou risco ao patrimônio,
            sem prejuízo da cobrança dos valores devidos.</p>
          </section>

          <section id="limitacao">
            <h2 className="text-2xl font-bold text-primary mb-3">14. Limitação de responsabilidade</h2>
            <p>A Oli Locação não se responsabiliza por danos decorrentes de uso indevido do veículo,
            descumprimento contratual, força maior, caso fortuito, indisponibilidade momentânea do
            site ou de canais de terceiros, nem por bens deixados no veículo após a devolução.</p>
          </section>

          <section id="propriedade">
            <h2 className="text-2xl font-bold text-primary mb-3">15. Propriedade intelectual</h2>
            <p>Marca, logotipo, layout, textos, imagens e demais elementos do site são de
            titularidade da Oli Locação ou de seus licenciantes, sendo vedada qualquer utilização sem
            autorização prévia.</p>
          </section>

          <section id="dados">
            <h2 className="text-2xl font-bold text-primary mb-3">16. Proteção de dados pessoais</h2>
            <p>O tratamento de dados pessoais é realizado conforme a Política de Privacidade e a
            LGPD (Lei nº 13.709/2018).</p>
          </section>

          <section id="alteracoes">
            <h2 className="text-2xl font-bold text-primary mb-3">17. Alterações dos Termos</h2>
            <p>Estes Termos podem ser alterados a qualquer momento, sem aviso prévio. A versão
            vigente é sempre a publicada no site.</p>
          </section>

          <section id="lei">
            <h2 className="text-2xl font-bold text-primary mb-3">18. Lei aplicável e foro</h2>
            <p>Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de São
            Paulo/SP para dirimir quaisquer controvérsias, renunciando-se a qualquer outro, por mais
            privilegiado que seja.</p>
          </section>

          <section id="contato" className="border-t pt-6">
            <h2 className="text-2xl font-bold text-primary mb-3">19. Contato</h2>
            <div className="space-y-1 text-muted-foreground">
              <p><strong className="text-foreground">OLI LOCACAO DE VEICULOS LTDA</strong></p>
              <p>Nome fantasia: OLI</p>
              <p>CNPJ: 57.448.288/0001-89</p>
              <p>Inscrição Estadual: 150.999.730.115</p>
              <p>Endereço: Rua José Silvestre da Cruz, nº 3, Parque Arariba, São Paulo/SP, CEP 05778-220</p>
              <p>Telefone/WhatsApp: +55 11 94017-5031</p>
              <p>E-mail: [E-MAIL DE CONTATO]</p>
            </div>
            <Button asChild className="mt-6 bg-success hover:bg-success/90 text-success-foreground">
              <a href="https://wa.me/5511940175031" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </section>
        </Card>
      </div>
    </WebLayout>
  );
}
