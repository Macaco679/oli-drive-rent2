import { LegalLayout } from "@/components/layout/LegalLayout";

const toc = [
  { id: "introducao", label: "Introdução" },
  { id: "dados-coletados", label: "1. Dados que podemos coletar" },
  { id: "finalidades", label: "2. Finalidades do uso" },
  { id: "bases-legais", label: "3. Bases legais" },
  { id: "compartilhamento", label: "4. Compartilhamento de dados" },
  { id: "whatsapp", label: "5. WhatsApp e atendimento" },
  { id: "cookies", label: "6. Cookies" },
  { id: "rastreamento", label: "7. Rastreamento e telemetria" },
  { id: "seguranca", label: "8. Armazenamento e segurança" },
  { id: "direitos", label: "9. Direitos do titular (LGPD)" },
  { id: "menores", label: "10. Dados de menores" },
  { id: "marketing", label: "11. Marketing e comunicações" },
  { id: "links", label: "12. Links externos" },
  { id: "alteracoes", label: "13. Alterações desta política" },
  { id: "contato", label: "14. Contato" },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      subtitle="Como a Oli Locação coleta, utiliza, armazena e protege seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018)."
      toc={toc}
    >
      <p className="text-sm text-muted-foreground"><strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}</p>

      <h2 id="introducao">Introdução</h2>
      <p>
        A presente Política de Privacidade explica como a <strong>OLI LOCACAO DE VEICULOS LTDA</strong>,
        nome fantasia <strong>OLI</strong>, inscrita no CNPJ nº <strong>57.448.288/0001-89</strong>, com sede na
        Rua José Silvestre da Cruz, nº 3, Parque Arariba, São Paulo/SP, CEP 05778-220, coleta, utiliza,
        armazena, compartilha e protege os dados pessoais de usuários, clientes, interessados, locatários,
        condutores, proprietários de veículos, parceiros e demais pessoas que acessam o site, entram em
        contato por WhatsApp, telefone, formulário, redes sociais ou contratam serviços de locação.
      </p>
      <p>
        Ao acessar o site, enviar informações, solicitar atendimento, realizar cadastro, reservar veículo
        ou contratar serviços, o usuário declara estar ciente desta Política e concorda com o tratamento
        de seus dados pessoais nos termos aqui descritos.
      </p>

      <h2 id="dados-coletados">1. Dados que podemos coletar</h2>
      <p>Para prestar nossos serviços, podemos coletar as seguintes categorias de dados:</p>
      <ul>
        <li><strong>Dados cadastrais:</strong> nome completo, CPF, RG, data de nascimento, estado civil, profissão, filiação, nacionalidade.</li>
        <li><strong>Dados de contato:</strong> telefone, WhatsApp, e-mail, endereço residencial, comprovante de residência.</li>
        <li><strong>Documentos:</strong> CNH (categoria, validade, número de registro), foto e selfie para validação, comprovantes de renda e ocupação.</li>
        <li><strong>Dados financeiros:</strong> dados de cartão de crédito (tokenizados via gateway), comprovantes de pagamento, histórico de transações, dados bancários para reembolso de caução.</li>
        <li><strong>Dados de análise cadastral:</strong> consultas a birôs de crédito, restrições, score, antecedentes para risco de fraude e inadimplência.</li>
        <li><strong>Dados do veículo locado:</strong> placa, quilometragem, vistorias, fotos, histórico de uso, infrações e ocorrências.</li>
        <li><strong>Dados de localização e telemetria:</strong> coordenadas GPS, rotas, velocidade e status do rastreador instalado no veículo.</li>
        <li><strong>Dados de navegação:</strong> endereço IP, dispositivo, navegador, páginas visitadas, cookies e identificadores online.</li>
        <li><strong>Dados de comunicação:</strong> registros de mensagens, áudios e atendimentos via WhatsApp, telefone, e-mail ou formulário.</li>
      </ul>

      <h2 id="finalidades">2. Finalidades do uso dos dados</h2>
      <ul>
        <li>Realizar análise cadastral, prevenção a fraude e avaliação de risco de crédito.</li>
        <li>Formalizar propostas, contratos digitais, vistorias, entregas e devoluções de veículos.</li>
        <li>Processar pagamentos, caução, multas, danos, avarias, sinistros e demais cobranças.</li>
        <li>Cumprir obrigações legais, regulatórias, fiscais e contratuais.</li>
        <li>Localizar, monitorar e, quando aplicável, recuperar veículos em casos de inadimplência ou apropriação indevida.</li>
        <li>Atender solicitações de autoridades públicas, polícia, Detran, Receita Federal e poder judiciário.</li>
        <li>Prestar suporte, atendimento e comunicação operacional sobre o contrato.</li>
        <li>Aprimorar a segurança, a operação, os produtos e serviços oferecidos.</li>
        <li>Enviar comunicações de marketing, quando autorizado pelo titular.</li>
      </ul>

      <h2 id="bases-legais">3. Bases legais para tratamento dos dados</h2>
      <p>O tratamento de dados pessoais ocorre com fundamento em uma ou mais das bases legais previstas na LGPD:</p>
      <ul>
        <li><strong>Execução de contrato</strong> ou de procedimentos preliminares relacionados à locação.</li>
        <li><strong>Cumprimento de obrigação legal ou regulatória</strong> aplicável à atividade de locação de veículos.</li>
        <li><strong>Legítimo interesse</strong> da Oli Locação, especialmente para prevenção a fraude, segurança patrimonial e cobrança.</li>
        <li><strong>Consentimento</strong> do titular, quando exigido (por exemplo, para envio de marketing).</li>
        <li><strong>Proteção do crédito</strong>, conforme autorizado pela legislação.</li>
        <li><strong>Exercício regular de direitos</strong> em processo judicial, administrativo ou arbitral.</li>
      </ul>

      <h2 id="compartilhamento">4. Compartilhamento de dados</h2>
      <p>A Oli Locação poderá compartilhar dados pessoais com:</p>
      <ul>
        <li><strong>Proprietários de veículos parceiros</strong>, quando aplicável à execução do contrato de locação.</li>
        <li><strong>Seguradoras, oficinas, guincho e pátios</strong> em caso de sinistros, manutenção, reparo ou apreensão.</li>
        <li><strong>Birôs de crédito e empresas de prevenção a fraude</strong>, para análise cadastral.</li>
        <li><strong>Empresas de rastreamento e telemetria</strong>, para monitoramento e recuperação do veículo.</li>
        <li><strong>Meios de pagamento, gateways e instituições financeiras</strong>, para processar transações e caução.</li>
        <li><strong>Plataformas de assinatura digital de contrato</strong> (ex.: Clicksign).</li>
        <li><strong>Autoridades públicas, Detran, polícia, Receita Federal e poder judiciário</strong>, mediante obrigação legal ou ordem judicial.</li>
        <li><strong>Escritórios de cobrança e advocacia</strong>, em caso de inadimplência ou litígio.</li>
        <li><strong>Prestadores de tecnologia, hospedagem e atendimento</strong> contratados sob obrigação de sigilo.</li>
      </ul>

      <h2 id="whatsapp">5. WhatsApp, formulários e atendimento</h2>
      <p>
        Ao entrar em contato pelo WhatsApp, telefone, e-mail ou formulários do site, o usuário autoriza o
        tratamento dos dados informados para fins de atendimento, envio de propostas, esclarecimento de
        dúvidas, formalização de cadastro e execução do contrato. O histórico de mensagens, áudios e
        documentos enviados pode ser armazenado para fins de comprovação, auditoria e cumprimento de
        obrigações legais.
      </p>

      <h2 id="cookies">6. Cookies e tecnologias de navegação</h2>
      <p>
        O site pode utilizar cookies próprios e de terceiros para funcionamento essencial, análise de
        navegação, métricas e melhorias. O usuário pode gerenciar cookies nas configurações do navegador,
        ciente de que algumas funcionalidades podem ser limitadas em caso de bloqueio.
      </p>

      <h2 id="rastreamento">7. Rastreamento, localização e telemetria dos veículos</h2>
      <p>
        Os veículos da frota podem possuir <strong>rastreador, telemetria e sistemas de bloqueio</strong>{" "}
        que registram localização, rota, velocidade e demais dados operacionais. Esses dados são
        utilizados para fins de segurança patrimonial, prevenção a sinistros, recuperação do veículo em
        caso de roubo, furto, apropriação indevida, inadimplência ou descumprimento contratual, sempre
        respeitada a legislação aplicável.
      </p>

      <h2 id="seguranca">8. Armazenamento e segurança dos dados</h2>
      <p>
        Os dados são armazenados em ambiente controlado, com medidas técnicas e administrativas razoáveis
        para protegê-los contra acesso não autorizado, perda, alteração, destruição ou divulgação
        indevida. Os dados são mantidos pelo prazo necessário ao cumprimento das finalidades, obrigações
        legais e exercício regular de direitos.
      </p>

      <h2 id="direitos">9. Direitos do titular dos dados (LGPD)</h2>
      <p>O titular dos dados pode, a qualquer momento e mediante requisição comprovada de identidade:</p>
      <ul>
        <li>Confirmar a existência de tratamento de seus dados;</li>
        <li>Acessar seus dados pessoais;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
        <li>Solicitar portabilidade dos dados;</li>
        <li>Obter informações sobre o compartilhamento de dados;</li>
        <li>Revogar o consentimento, quando aplicável;</li>
        <li>Opor-se a tratamentos com base em outras hipóteses legais;</li>
        <li>Apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>
      <p>
        Algumas solicitações podem ser limitadas pela necessidade de cumprimento de obrigações legais,
        contratuais ou exercício regular de direitos pela Oli Locação.
      </p>

      <h2 id="menores">10. Dados de menores de idade</h2>
      <p>
        Os serviços de locação são destinados a maiores de 18 anos com CNH válida. A Oli Locação não
        coleta intencionalmente dados de menores. Caso identificado, os dados serão eliminados, exceto
        quando exigida a guarda por obrigação legal.
      </p>

      <h2 id="marketing">11. Marketing e comunicações</h2>
      <p>
        Poderemos enviar comunicações sobre promoções, lançamentos e novidades, sempre com opção de
        descadastramento. Comunicações operacionais relacionadas ao contrato (cobranças, vencimentos,
        alertas, vistorias) não dependem de consentimento de marketing.
      </p>

      <h2 id="links">12. Links externos</h2>
      <p>
        O site pode conter links para sites de terceiros (parceiros, redes sociais, meios de pagamento).
        A Oli Locação não se responsabiliza pelas práticas de privacidade desses sites, sendo
        recomendada a leitura das políticas de cada um.
      </p>

      <h2 id="alteracoes">13. Alterações desta política</h2>
      <p>
        Esta Política pode ser atualizada a qualquer momento, sem aviso prévio individualizado, sempre
        que houver mudança em práticas, legislação ou serviços. A versão vigente é a publicada nesta
        página, identificada pela data da última atualização.
      </p>

      <h2 id="contato">14. Contato</h2>
      <p>Para exercer direitos ou tirar dúvidas sobre privacidade, entre em contato:</p>
      <ul>
        <li><strong>OLI LOCACAO DE VEICULOS LTDA</strong></li>
        <li><strong>CNPJ:</strong> 57.448.288/0001-89</li>
        <li><strong>Inscrição Estadual:</strong> 150.999.730.115</li>
        <li><strong>Endereço:</strong> Rua José Silvestre da Cruz, nº 3, Parque Arariba, São Paulo/SP, CEP 05778-220</li>
        <li><strong>Telefone/WhatsApp:</strong> +55 11 94017-5031</li>
        <li><strong>E-mail:</strong> [E-MAIL DE CONTATO]</li>
      </ul>
    </LegalLayout>
  );
}
