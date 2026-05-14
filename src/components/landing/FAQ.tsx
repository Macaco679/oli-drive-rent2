import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Qual a duração mínima do contrato para motoristas de aplicativo?",
    answer:
      "O contrato para motoristas de aplicativo tem duração mínima de 3 meses.",
  },
  {
    question: "Como funciona a caução?",
    answer:
      "O valor da caução é informado no card de cada veículo. Oferecemos opção de parcelamento da caução para facilitar seu início. A caução é devolvida ao final do contrato, conforme as regras estabelecidas.",
  },
  {
    question: "Quais apps posso usar?",
    answer:
      "Você pode usar os principais apps de mobilidade como Uber, 99 e InDrive, além de apps de entrega como iFood, Rappi, Loggi, Lalamove, Mercado Livre e Shopee.",
  },
  {
    question: "Há limite de quilometragem?",
    answer:
      "Nossa política padrão oferece quilometragem livre para trabalho. Os detalhes exatos são informados no contrato de locação.",
  },
  {
    question: "O seguro está incluído?",
    answer:
      "Sim, todos os veículos possuem seguro. As informações sobre franquia e coberturas específicas são detalhadas no contrato.",
  },
  {
    question: "Como funcionam as manutenções e revisões?",
    answer:
      "As manutenções preventivas são programadas e realizadas pela locadora. Você será avisado com antecedência para agendar o melhor horário.",
  },
  {
    question: "O que acontece em caso de atraso no pagamento?",
    answer:
      "Em caso de atraso, incidirá multa e juros conforme estabelecido em contrato. Recomendamos sempre manter os pagamentos em dia.",
  },
  {
    question: "Posso ter um veículo reserva durante manutenção?",
    answer:
      "Sim, fornecemos veículo reserva durante manutenções programadas, conforme disponibilidade em nossa frota.",
  },
  {
    question: "Como funciona a devolução do veículo?",
    answer:
      "Ao final do contrato, agendamos uma vistoria de devolução. Após o acerto final, a caução é devolvida conforme as regras estabelecidas no contrato.",
  },
  {
    question: "Quais documentos preciso apresentar?",
    answer:
      "Você precisará de CNH válida, documentos pessoais (RG/CPF) e comprovantes básicos de residência e renda para análise.",
  },
  {
    question: "Posso comprar o carro depois?",
    answer:
      "Sim! Após 1 ano de contrato, você tem prioridade de compra do veículo. Entre em contato para conhecer as condições especiais.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dúvidas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Respostas para as perguntas mais comuns
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
