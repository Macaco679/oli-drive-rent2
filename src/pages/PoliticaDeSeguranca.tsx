import { LegalLayout } from "@/components/layout/LegalLayout";

const toc = [
  { id: "objetivo", label: "1. Objetivo e escopo" },
  { id: "principios", label: "2. Princípios" },
  { id: "controle-acesso", label: "3. Controle de acesso" },
  { id: "protecao-dados", label: "4. Proteção de dados" },
  { id: "retencao", label: "5. Retenção e descarte" },
  { id: "fornecedores", label: "6. Gestão de fornecedores" },
  { id: "avaliacao-risco", label: "7. Avaliação de risco e testes" },
  { id: "resposta-incidentes", label: "8. Resposta a incidentes" },
  { id: "treinamento", label: "9. Treinamento e conscientização" },
  { id: "lgpd", label: "10. Conformidade com a LGPD" },
  { id: "revisao", label: "11. Revisão desta política" },
];

export default function PoliticaDeSeguranca() {
  return (
    <LegalLayout
      title="Política de Segurança da Informação"
      subtitle="Princípios, responsabilidades e controles mínimos de segurança da informação adotados pela Oli Locação na operação de sua plataforma digital."
      toc={toc}
    >
      <p className="text-sm text-muted-foreground"><strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}</p>

      <h2 id="objetivo">1. Objetivo e escopo</h2>
      <p>
        Esta política estabelece os princípios, responsabilidades e controles mínimos de segurança da
        informação adotados pela <strong>OLI LOCACAO DE VEICULOS LTDA</strong>, CNPJ nº <strong>57.448.288/0001-89</strong>,
        na operação de sua plataforma digital (site, aplicativo e integrações), com foco na proteção de
        dados pessoais de locatários e locadores, dados de veículos e dados financeiros processados na
        intermediação de locação.
      </p>
      <p>
        Aplica-se a todos os sistemas que armazenam, processam ou transmitem dados da Oli Locação: banco
        de dados e autenticação de usuários, automações de backend, frontend/aplicativo, processamento de
        pagamentos e validação de identidade/CNH junto aos órgãos competentes.
      </p>

      <h2 id="principios">2. Princípios</h2>
      <p>
        Adotamos como princípios norteadores a <strong>confidencialidade</strong> (dados acessíveis apenas
        a quem tem necessidade legítima), a <strong>integridade</strong> (dados protegidos contra alteração
        não autorizada) e a <strong>disponibilidade</strong> (sistemas acessíveis quando necessários para a
        operação). Os controles de segurança são aplicados de forma proporcional ao risco e à
        sensibilidade do dado — dados de identificação pessoal (CPF, CNH, endereço) e dados financeiros
        recebem o nível mais alto de proteção.
      </p>

      <h2 id="controle-acesso">3. Controle de acesso</h2>
      <p>
        O acesso aos sistemas é individualizado — não há contas compartilhadas. Cada usuário da plataforma
        (locatário ou locador) autentica-se com credenciais próprias, e o acesso aos dados é restrito por
        políticas de segurança em nível de linha no banco de dados, limitando cada usuário aos seus
        próprios registros e aos registros das locações das quais participa.
      </p>
      <p>
        O acesso administrativo à infraestrutura é restrito à equipe técnica responsável e revisado
        periodicamente (mínimo semestral), com revogação em até 24 horas do desligamento ou mudança de
        função de qualquer pessoa com acesso.
      </p>
      <p>
        Está em processo de implantação a autenticação multifator (MFA) para contas de usuário,
        priorizando perfis administrativos e de maior privilégio, com comunicação prévia à base de
        usuários ativos antes de qualquer exigência obrigatória.
      </p>

      <h2 id="protecao-dados">4. Proteção de dados</h2>
      <p>
        Dados em trânsito são protegidos por TLS/HTTPS em todas as integrações (site, banco de dados,
        automações, pagamento). Dados em repouso no banco de dados são protegidos pela criptografia de
        disco da infraestrutura gerenciada utilizada.
      </p>
      <p>
        Dados de cartão de pagamento (número completo e código de segurança) são tratados como dado de
        máxima sensibilidade. Estamos migrando o fluxo de pagamento por cartão para uso de tokenização do
        provedor de pagamento, de forma que o dado bruto do cartão deixe de ser retido em texto puro nos
        sistemas internos após o processamento inicial. Até a conclusão dessa migração, o histórico de
        execução do sistema que processa pagamentos é tratado como dado restrito, com acesso limitado à
        equipe técnica.
      </p>
      <p>
        Colunas de dados sensíveis de veículos (placa, RENAVAM, endereço de retirada) e de documentos de
        identificação (CNH) não são expostas a usuários não autenticados; o acesso público à plataforma é
        limitado às informações necessárias para a vitrine de veículos disponíveis (marca, modelo, foto,
        preço, localização aproximada).
      </p>
      <p>
        Cópias de dados (exports, backups, integrações de terceiros) são controladas e limitadas ao
        mínimo necessário para a finalidade de cada integração. Chaves de API e credenciais de
        integrações de terceiros são armazenadas em cofre de credenciais dedicado, nunca em texto puro no
        código-fonte.
      </p>

      <h2 id="retencao">5. Retenção e descarte</h2>
      <p>
        Dados pessoais e financeiros são retidos pelo tempo necessário à prestação do serviço e ao
        cumprimento de obrigações legais e contratuais. O histórico de execução de automações que
        processam dados sensíveis (pagamento, validação de CNH) tem sua retenção ajustada ao mínimo
        necessário para suporte e auditoria, evitando acúmulo desnecessário de dado sensível em texto
        puro.
      </p>

      <h2 id="fornecedores">6. Gestão de fornecedores e integrações de terceiros</h2>
      <p>
        Integrações com terceiros que processam dados da Oli Locação (pagamento, validação de identidade,
        infraestrutura, hospedagem do código-fonte) são avaliadas quanto à sua postura de segurança antes
        da adoção e revisadas periodicamente. Qualquer conta de terceiro utilizada para processar
        transações em nome da Oli Locação deve ser formalizada por contrato ou, preferencialmente,
        substituída por conta própria assim que operacionalmente viável.
      </p>

      <h2 id="avaliacao-risco">7. Avaliação de risco e testes de segurança</h2>
      <p>
        Realizamos avaliações de risco técnico de nossa plataforma de forma recorrente (mínimo
        trimestral), cobrindo configuração de banco de dados, automações, autenticação e integrações de
        pagamento, com correção priorizada por severidade. Vulnerabilidades identificadas com risco de
        exposição de dados pessoais ou financeiros são tratadas com prioridade máxima.
      </p>

      <h2 id="resposta-incidentes">8. Resposta a incidentes</h2>
      <p>
        Mantemos um plano de resposta a incidentes específico, que define como incidentes de segurança
        são detectados, classificados, contidos e comunicados, incluindo os prazos e obrigações da Lei
        Geral de Proteção de Dados (LGPD) quando aplicável. Suspeitas de incidente podem ser reportadas
        pelos canais de contato ao final desta página.
      </p>

      <h2 id="treinamento">9. Treinamento e conscientização</h2>
      <p>
        Os membros da equipe com acesso a sistemas e dados da Oli Locação recebem orientação sobre
        práticas seguras de desenvolvimento, gestão de credenciais e resposta a incidentes, revisada
        sempre que houver mudança relevante de sistema ou processo.
      </p>

      <h2 id="lgpd">10. Conformidade com a LGPD</h2>
      <p>
        Mantemos, ou estamos em processo de formalizar, o registro das operações de tratamento de dados
        pessoais realizadas (art. 37 da LGPD), identificando finalidade, base legal, tipos de dado
        tratado e retenção, para as categorias de dados de locatários, locadores e terceiros envolvidos
        na intermediação de locação. Para mais detalhes sobre como tratamos dados pessoais, consulte
        também nossa Política de Privacidade.
      </p>

      <h2 id="revisao">11. Revisão desta política</h2>
      <p>
        Esta política é revisada no mínimo anualmente, ou sempre que houver mudança relevante na
        infraestrutura, nos fornecedores de tecnologia ou na legislação aplicável.
      </p>
    </LegalLayout>
  );
}
