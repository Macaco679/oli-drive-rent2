import { LegalLayout } from "@/components/layout/LegalLayout";

const toc = [
  { id: "introducao", label: "Introdução" },
  { id: "definicoes", label: "1. Definições" },
  { id: "objeto", label: "2. Objeto" },
  { id: "informacoes-site", label: "3. Informações do site" },
  { id: "cadastro", label: "4. Cadastro, análise e aprovação" },
  { id: "reserva", label: "5. Reserva e disponibilidade" },
  { id: "caucao", label: "6. Caução, pagamentos e cobranças" },
  { id: "obrigacoes-locatario", label: "7. Obrigações do locatário" },
  { id: "obrigacoes-oli", label: "8. Obrigações da Oli Locação" },
  { id: "uso-veiculo", label: "9. Uso do veículo" },
  { id: "multas", label: "10. Multas, avarias e sinistros" },
  { id: "rastreamento", label: "11. Rastreamento e recuperação" },
  { id: "devolucao", label: "12. Devolução do veículo" },
  { id: "cancelamento", label: "13. Cancelamento e rescisão" },
  { id: "limitacao", label: "14. Limitação de responsabilidade" },
  { id: "propriedade", label: "15. Propriedade intelectual" },
  { id: "dados", label: "16. Proteção de dados pessoais" },
  { id: "alteracoes", label: "17. Alterações dos Termos" },
  { id: "foro", label: "18. Lei aplicável e foro" },
  { id: "contato", label: "19. Contato" },
];

export default function TermsOfUse() {
  return (
    <LegalLayout
      title="Termos de Uso e Condições Gerais"
      subtitle="Regras para acesso ao site, uso dos canais de atendimento e contratação dos serviços de locação de veículos da Oli Locação."
      toc={toc}
    >
      <p className="text-sm text-muted-foreground"><strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}</p>

      <h2 id="introducao">Introdução</h2>
      <p>
        Estes Termos de Uso e Condições Gerais regulam o acesso ao site da Oli Locação, o uso dos canais
        de atendimento e as condições básicas aplicáveis às solicitações, propostas, reservas e
        contratações de locação de veículos.
      </p>
      <p>
        A Oli Locação é marca da <strong>OLI LOCACAO DE VEICULOS LTDA</strong>, inscrita no CNPJ nº{" "}
        <strong>57.448.288/0001-89</strong>, com sede na Rua José Silvestre da Cruz, nº 3, Parque
        Arariba, São Paulo/SP, CEP 05778-220.
      </p>
      <p>
        Ao acessar o site, solicitar atendimento, enviar documentos, realizar cadastro, reservar veículo
        ou contratar qualquer serviço, o usuário declara que leu, entendeu e concorda integralmente com
        estes Termos. Caso não concorde, não deve utilizar o site nem contratar os serviços.
      </p>

      <h2 id="definicoes">1. Definições</h2>
      <ul>
        <li><strong>Oli Locação:</strong> OLI LOCACAO DE VEICULOS LTDA, prestadora dos serviços de locação.</li>
        <li><strong>Site:</strong> o endereço eletrônico oficial da Oli Locação e demais canais oficiais de atendimento.</li>
        <li><strong>Usuário:</strong> qualquer pessoa que acesse o site ou utilize os canais de atendimento.</li>
        <li><strong>Locatário:</strong> pessoa física ou jurídica que contrata a locação do veículo.</li>
        <li><strong>Condutor:</strong> pessoa autorizada formalmente a conduzir o veículo locado.</li>
        <li><strong>Contrato:</strong> instrumento específico de locação assinado entre as partes.</li>
        <li><strong>Caução:</strong> valor exigido como garantia das obrigações do locatário.</li>
        <li><strong>Veículo:</strong> automóvel disponibilizado na frota da Oli Locação ou de proprietários parceiros.</li>
      </ul>

      <h2 id="objeto">2. Objeto</h2>
      <p>
        O objeto destes Termos é regular o acesso e uso do site, bem como as condições gerais aplicáveis
        à locação de veículos pela Oli Locação, incluindo cadastro, análise, reserva, pagamento,
        retirada, uso, devolução e demais aspectos da relação contratual.
      </p>

      <h2 id="informacoes-site">3. Informações do site</h2>
      <p>
        Imagens, valores, planos, modelos, anos, cores, opcionais e disponibilidade exibidos no site são{" "}
        <strong>meramente ilustrativos</strong> e podem variar conforme estoque, sazonalidade,
        manutenção, sinistro ou outras condições operacionais.
      </p>
      <p>
        As condições do site podem ser alteradas a qualquer momento, <strong>sem aviso prévio
        individualizado</strong>. Promoções e tabelas de preço podem ter prazo de validade, restrições e
        critérios específicos.
      </p>
      <p>
        O <strong>contrato específico de locação</strong> assinado entre as partes prevalecerá sobre as
        informações genéricas do site sempre que houver divergência.
      </p>

      <h2 id="cadastro">4. Cadastro, análise e aprovação</h2>
      <p>
        A contratação <strong>não é automática</strong> pelo site. A formalização da locação depende de:
      </p>
      <ul>
        <li>Envio de documentos pessoais e CNH categoria B válida do condutor;</li>
        <li>Análise cadastral, de risco e de prevenção a fraude;</li>
        <li>Disponibilidade do veículo escolhido;</li>
        <li>Pagamento da primeira parcela e da caução, quando aplicável;</li>
        <li>Assinatura digital do contrato de locação;</li>
        <li>Realização da vistoria de retirada.</li>
      </ul>
      <p>
        A Oli Locação poderá <strong>negar cadastro, recusar proposta, cancelar reserva ou interromper
        atendimento</strong> em caso de risco, inconsistência documental, suspeita de fraude,
        inadimplência, descumprimento de regras, indisponibilidade ou qualquer outro motivo legítimo,
        sem necessidade de justificativa detalhada.
      </p>

      <h2 id="reserva">5. Reserva e disponibilidade</h2>
      <p>
        A reserva manifestada pelo usuário não garante a locação. A locação somente se efetiva após
        cumpridas todas as etapas do item anterior. A Oli Locação não se responsabiliza por
        indisponibilidades resultantes de manutenção, sinistro, apreensão, recolhimento, perda total ou
        outras situações alheias a sua vontade.
      </p>

      <h2 id="caucao">6. Caução, pagamentos e cobranças</h2>
      <p>
        A caução é exigida como garantia e <strong>somente é aceita por cartão de crédito</strong>,
        podendo ser parcelada conforme política vigente. O valor poderá ser utilizado para compensar
        eventuais débitos pendentes, multas, avarias, sinistros, franquias, combustível, limpeza
        especial, diárias adicionais, custos de pátio, guincho ou qualquer outro débito previsto em
        contrato.
      </p>
      <p>
        A devolução da caução depende de conferência do veículo, apuração de multas (que podem chegar
        meses após a devolução), avarias, sinistros e demais pendências, podendo ser parcial ou total
        conforme apuração.
      </p>
      <p>
        Atrasos no pagamento podem gerar bloqueio do veículo, multa, juros, correção monetária,
        cobrança de honorários, negativação em birôs de crédito e adoção de medidas judiciais.
      </p>

      <h2 id="obrigacoes-locatario">7. Obrigações do locatário e do condutor</h2>
      <ul>
        <li>Fornecer dados verdadeiros, atualizados e documentos válidos;</li>
        <li>Conduzir o veículo apenas com CNH válida e dentro da legislação de trânsito;</li>
        <li>Respeitar regras do contrato, vistoria e estado do veículo;</li>
        <li>Pagar pontualmente todas as parcelas, caução, multas e demais valores;</li>
        <li>Comunicar imediatamente sinistros, furtos, roubos, apreensões e ocorrências relevantes;</li>
        <li>Devolver o veículo nas condições e prazo contratados;</li>
        <li>Não permitir condutor não autorizado, mesmo familiar;</li>
        <li>Não sublocar, emprestar, vender, ceder, transferir, dar em garantia, desmontar, adulterar nem usar o veículo para fins ilícitos.</li>
      </ul>

      <h2 id="obrigacoes-oli">8. Obrigações da Oli Locação</h2>
      <ul>
        <li>Disponibilizar o veículo em condições de uso e devidamente documentado;</li>
        <li>Realizar manutenções preventivas conforme plano de cada veículo;</li>
        <li>Prestar atendimento nos canais oficiais durante o horário comercial;</li>
        <li>Tratar dados pessoais conforme a Política de Privacidade e a LGPD;</li>
        <li>Cumprir o contrato específico assinado entre as partes.</li>
      </ul>

      <h2 id="uso-veiculo">9. Uso do veículo</h2>
      <p>O veículo deve ser utilizado de forma diligente, lícita e conforme o contrato. É vedado:</p>
      <ul>
        <li>Conduzir sob efeito de álcool, drogas ou substâncias proibidas;</li>
        <li>Participar de competições, rachas, off-road ou usos similares;</li>
        <li>Transportar carga incompatível com o veículo;</li>
        <li>Utilizar o veículo para atividades ilegais;</li>
        <li>Remover, desligar ou adulterar o rastreador, telemetria ou qualquer equipamento de segurança;</li>
        <li>Sair do território nacional sem autorização expressa.</li>
      </ul>
      <p>
        O uso do veículo para <strong>aplicativos de mobilidade e entrega</strong> (Uber, 99, InDrive,
        iFood, Rappi, Loggi, Mercado Livre, Shopee, entre outros) é permitido conforme o plano
        contratado.
      </p>

      <h2 id="multas">10. Multas, avarias, sinistros e responsabilidades</h2>
      <p>
        O locatário é integralmente responsável por <strong>multas de trânsito, infrações
        administrativas, danos, avarias, mau uso, atrasos na devolução, combustível, limpeza especial,
        sinistros, franquias e coparticipações de seguro, custos de guincho, pátio, apreensão, diárias
        adicionais, perda de chave, documentação, taxa de transferência de pontos e demais custos
        previstos em contrato.</strong>
      </p>
      <p>
        As multas serão repassadas ao condutor mediante indicação ao órgão competente. Custos
        administrativos podem incidir sobre cada repasse.
      </p>

      <h2 id="rastreamento">11. Rastreamento, bloqueio e recuperação do veículo</h2>
      <p>
        Os veículos podem possuir rastreador, telemetria e sistemas de bloqueio. Em caso de
        inadimplência, apropriação indevida, suspeita de fraude, descumprimento contratual,
        recusa de devolução, risco ao patrimônio ou ordem de autoridade competente, a Oli Locação
        poderá adotar medidas para localização, bloqueio, retomada extrajudicial ou judicial, cobrança
        e defesa de seus direitos, respeitada a legislação aplicável.
      </p>

      <h2 id="devolucao">12. Devolução do veículo</h2>
      <p>
        A devolução deve ocorrer no local, data e horário acordados, com o veículo nas mesmas condições
        da retirada, ressalvado o desgaste natural. Atrasos geram cobrança de diárias adicionais e
        podem caracterizar apropriação indevida. A vistoria de devolução é obrigatória para liberação da
        caução.
      </p>

      <h2 id="cancelamento">13. Cancelamento, suspensão ou rescisão</h2>
      <p>
        O contrato pode ser rescindido, suspenso ou cancelado, sem prejuízo de cobranças, em casos como
        inadimplência, descumprimento contratual, fraude, uso indevido, sinistro com perda total,
        apreensão, ordem judicial ou conforme regras específicas do contrato assinado.
      </p>

      <h2 id="limitacao">14. Limitação de responsabilidade</h2>
      <p>
        A Oli Locação não se responsabiliza por: (i) lucros cessantes do locatário decorrentes de
        manutenção, sinistro ou indisponibilidade do veículo; (ii) objetos pessoais deixados no veículo;
        (iii) infrações cometidas pelo condutor; (iv) danos a terceiros decorrentes do uso do veículo
        pelo locatário; (v) interrupções, falhas técnicas ou indisponibilidade temporária do site.
      </p>

      <h2 id="propriedade">15. Propriedade intelectual</h2>
      <p>
        Marca, logotipo, layout, textos, imagens, fotos, vídeos e demais elementos do site são de
        titularidade da Oli Locação ou de seus licenciantes, sendo vedada a reprodução, cópia ou uso
        sem autorização expressa.
      </p>

      <h2 id="dados">16. Proteção de dados pessoais</h2>
      <p>
        O tratamento de dados pessoais segue a{" "}
        <a href="/politica-de-privacidade">Política de Privacidade</a> da Oli Locação e a Lei nº
        13.709/2018 (LGPD).
      </p>

      <h2 id="alteracoes">17. Alterações dos Termos</h2>
      <p>
        Estes Termos podem ser alterados a qualquer momento, sem aviso prévio individualizado, valendo a
        versão publicada nesta página. O uso continuado do site após alterações implica concordância
        com a nova versão.
      </p>

      <h2 id="foro">18. Lei aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da
        Comarca de São Paulo/SP para dirimir quaisquer controvérsias, com renúncia a qualquer outro,
        por mais privilegiado que seja, ressalvado o foro do consumidor quando aplicável.
      </p>

      <h2 id="contato">19. Contato</h2>
      <ul>
        <li><strong>OLI LOCACAO DE VEICULOS LTDA</strong></li>
        <li><strong>Nome fantasia:</strong> OLI</li>
        <li><strong>CNPJ:</strong> 57.448.288/0001-89</li>
        <li><strong>Inscrição Estadual:</strong> 150.999.730.115</li>
        <li><strong>Endereço:</strong> Rua José Silvestre da Cruz, nº 3, Parque Arariba, São Paulo/SP, CEP 05778-220</li>
        <li><strong>Telefone/WhatsApp:</strong> +55 11 94017-5031</li>
        <li><strong>E-mail:</strong> [E-MAIL DE CONTATO]</li>
      </ul>
    </LegalLayout>
  );
}
