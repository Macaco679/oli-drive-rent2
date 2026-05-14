import { WebLayout } from "@/components/layout/WebLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const sections = [
  { id: "dados", title: "1. Dados que podemos coletar" },
  { id: "finalidades", title: "2. Finalidades do uso dos dados" },
  { id: "bases", title: "3. Bases legais para tratamento" },
  { id: "compartilhamento", title: "4. Compartilhamento de dados" },
  { id: "whatsapp", title: "5. WhatsApp, formulários e atendimento" },
  { id: "cookies", title: "6. Cookies e tecnologias de navegação" },
  { id: "rastreamento", title: "7. Rastreamento, localização e telemetria" },
  { id: "seguranca", title: "8. Armazenamento e segurança" },
  { id: "direitos", title: "9. Direitos do titular dos dados" },
  { id: "menores", title: "10. Dados de menores de idade" },
  { id: "marketing", title: "11. Marketing e comunicações" },
  { id: "links", title: "12. Links externos" },
  { id: "alteracoes", title: "13. Alterações da política" },
  { id: "contato", title: "14. Contato" },
];

export default function PrivacyPolicy() {
  return (
    <WebLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-lg md:text-xl opacity-90">
            Saiba como a Oli Locação coleta, utiliza e protege seus dados pessoais.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Index */}
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

        {/* Content */}
        <Card className="p-6 md:p-10 space-y-8 leading-relaxed text-foreground">
          <p className="text-muted-foreground">
            A presente Política de Privacidade explica como a <strong>OLI LOCACAO DE VEICULOS LTDA</strong>,
            nome fantasia <strong>OLI</strong>, inscrita no CNPJ nº <strong>57.448.288/0001-89</strong>, com
            sede na Rua José Silvestre da Cruz, nº 3, Parque Arariba, São Paulo/SP, CEP 05778-220, coleta,
            utiliza, armazena, compartilha e protege os dados pessoais de usuários, clientes, interessados,
            locatários, condutores, proprietários de veículos, parceiros e demais pessoas que acessam o site,
            entram em contato por WhatsApp, telefone, formulário, redes sociais ou contratam serviços de locação.
          </p>
          <p className="text-muted-foreground">
            Ao acessar o site, enviar informações, solicitar atendimento, realizar cadastro, reservar veículo
            ou contratar serviços, o usuário declara estar ciente desta Política.
          </p>

          <section id="dados">
            <h2 className="text-2xl font-bold text-primary mb-3">1. Dados que podemos coletar</h2>
            <p>Podemos coletar dados fornecidos diretamente por você, gerados pelo uso do site/app ou
            obtidos junto a parceiros, incluindo:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Dados de identificação: nome completo, RG, CPF, data de nascimento, nacionalidade, estado civil, profissão.</li>
              <li>Dados de contato: e-mail, telefone, WhatsApp, endereço residencial e comercial.</li>
              <li>Documentos: CNH, comprovante de residência, comprovante de renda, selfies para validação facial e assinatura digital.</li>
              <li>Dados financeiros e de pagamento: dados de cartão, PIX, comprovantes, histórico de pagamentos, caução, cobranças e inadimplência.</li>
              <li>Dados cadastrais e de análise de crédito/risco, inclusive consultas a bureaus.</li>
              <li>Dados de uso do veículo: localização, telemetria, quilometragem, eventos do rastreador, infrações, sinistros e avarias.</li>
              <li>Dados de navegação: IP, dispositivo, navegador, cookies, páginas visitadas, interações.</li>
            </ul>
          </section>

          <section id="finalidades">
            <h2 className="text-2xl font-bold text-primary mb-3">2. Finalidades do uso dos dados</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Realizar cadastro, análise documental e de crédito.</li>
              <li>Operacionalizar reservas, contratos, pagamentos, caução, vistorias e devoluções.</li>
              <li>Prestar atendimento via WhatsApp, e-mail, telefone, chat e formulários.</li>
              <li>Gerenciar contratos de locação, cobrar valores devidos, multas, avarias e franquias.</li>
              <li>Prevenir fraudes, inadimplência, sinistros e proteger o patrimônio.</li>
              <li>Cumprir obrigações legais, regulatórias, fiscais e contratuais.</li>
              <li>Aprimorar serviços, segurança, comunicação e experiência do usuário.</li>
            </ul>
          </section>

          <section id="bases">
            <h2 className="text-2xl font-bold text-primary mb-3">3. Bases legais para tratamento dos dados</h2>
            <p>Tratamos dados com base nas hipóteses previstas pela Lei Geral de Proteção de Dados (LGPD),
            principalmente: execução de contrato, cumprimento de obrigação legal/regulatória, legítimo
            interesse, exercício regular de direitos em processo, proteção ao crédito, prevenção à fraude
            e consentimento, quando aplicável.</p>
          </section>

          <section id="compartilhamento">
            <h2 className="text-2xl font-bold text-primary mb-3">4. Compartilhamento de dados</h2>
            <p>Podemos compartilhar dados com parceiros estritamente necessários à operação, tais como:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Meios de pagamento, adquirentes, gateways e instituições financeiras.</li>
              <li>Bureaus de crédito, antifraude e análise cadastral.</li>
              <li>Seguradoras, corretoras, oficinas mecânicas, guinchos e pátios.</li>
              <li>Empresas de rastreamento, telemetria e recuperação de veículos.</li>
              <li>Autoridades públicas, órgãos de trânsito, judiciais, fiscais e administrativos.</li>
              <li>Provedores de tecnologia, hospedagem, comunicação, e-mail e WhatsApp Business.</li>
            </ul>
          </section>

          <section id="whatsapp">
            <h2 className="text-2xl font-bold text-primary mb-3">5. WhatsApp, formulários e atendimento</h2>
            <p>Ao iniciar conversa pelo WhatsApp, preencher formulários ou enviar mensagens pelos nossos
            canais, você autoriza o tratamento das informações enviadas para fins de atendimento, cadastro,
            proposta, contratação e comunicação posterior relacionada aos serviços. As conversas podem ser
            armazenadas para fins de histórico, qualidade e segurança.</p>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-primary mb-3">6. Cookies e tecnologias de navegação</h2>
            <p>Utilizamos cookies e tecnologias semelhantes para autenticar usuários, manter sessões,
            medir desempenho, personalizar conteúdo e melhorar a experiência. Você pode gerenciar cookies
            nas configurações do seu navegador.</p>
          </section>

          <section id="rastreamento">
            <h2 className="text-2xl font-bold text-primary mb-3">7. Rastreamento, localização e telemetria dos veículos</h2>
            <p>Os veículos da frota podem possuir equipamentos de rastreamento, telemetria e sistemas de
            segurança. Esses recursos permitem monitorar localização, deslocamento, padrões de uso, eventos
            de risco, bloqueio remoto e recuperação em caso de furto, roubo, apropriação indevida,
            inadimplência ou descumprimento contratual, sempre conforme a legislação aplicável.</p>
          </section>

          <section id="seguranca">
            <h2 className="text-2xl font-bold text-primary mb-3">8. Armazenamento e segurança dos dados</h2>
            <p>Adotamos medidas técnicas e administrativas adequadas para proteger seus dados contra
            acessos não autorizados, perda, destruição ou alteração indevida. Os dados são armazenados
            pelo tempo necessário ao cumprimento das finalidades e obrigações legais.</p>
          </section>

          <section id="direitos">
            <h2 className="text-2xl font-bold text-primary mb-3">9. Direitos do titular dos dados</h2>
            <p>Nos termos da LGPD, você pode solicitar:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Confirmação da existência de tratamento.</li>
              <li>Acesso, correção, atualização ou portabilidade dos dados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Informação sobre compartilhamento.</li>
              <li>Revogação de consentimento, quando aplicável.</li>
            </ul>
            <p className="mt-2">As solicitações devem ser feitas pelos canais oficiais de contato.</p>
          </section>

          <section id="menores">
            <h2 className="text-2xl font-bold text-primary mb-3">10. Dados de menores de idade</h2>
            <p>Nossos serviços são destinados a maiores de 18 anos. Não coletamos intencionalmente dados
            de menores. Caso identifique tratamento indevido, entre em contato para remoção.</p>
          </section>

          <section id="marketing">
            <h2 className="text-2xl font-bold text-primary mb-3">11. Marketing e comunicações</h2>
            <p>Podemos enviar comunicações sobre serviços, promoções e novidades por e-mail, WhatsApp ou
            SMS. Você pode solicitar o descadastramento a qualquer momento.</p>
          </section>

          <section id="links">
            <h2 className="text-2xl font-bold text-primary mb-3">12. Links externos</h2>
            <p>O site pode conter links para páginas de terceiros. Não nos responsabilizamos pelas
            práticas de privacidade desses sites.</p>
          </section>

          <section id="alteracoes">
            <h2 className="text-2xl font-bold text-primary mb-3">13. Alterações da política</h2>
            <p>Esta Política pode ser atualizada a qualquer tempo, sem aviso prévio. Recomendamos a
            consulta periódica.</p>
          </section>

          <section id="contato" className="border-t pt-6">
            <h2 className="text-2xl font-bold text-primary mb-3">14. Contato</h2>
            <div className="space-y-1 text-muted-foreground">
              <p><strong className="text-foreground">OLI LOCACAO DE VEICULOS LTDA</strong></p>
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
