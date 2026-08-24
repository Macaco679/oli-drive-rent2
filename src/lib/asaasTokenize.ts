import { supabase } from "@/integrations/supabase/client";

export interface AsaasTokenizeClient {
  nome: string;
  email: string;
  cpf: string;
  celular: string;
}

export interface AsaasTokenizeCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface AsaasTokenizeResult {
  creditCardToken: string;
  creditCardBrand: string | null;
  creditCardLast4: string | null;
  asaasCustomerId: string;
}

/**
 * Tokeniza o cartao de credito diretamente na Asaas, atraves da Edge
 * Function "asaas-tokenize-card". O numero completo e o CVV saem do
 * navegador direto para essa funcao e nunca passam pelo n8n - so o token
 * retornado aqui e enviado adiante para criar a cobranca.
 */
export async function tokenizeCard(
  cliente: AsaasTokenizeClient,
  cartao: AsaasTokenizeCard,
): Promise<AsaasTokenizeResult> {
  const { data, error } = await supabase.functions.invoke("asaas-tokenize-card", {
    body: { cliente, cartao },
  });

  if (error) {
    throw new Error("Nao foi possivel validar o cartao. Tente novamente.");
  }

  if (!data?.ok || !data?.creditCardToken) {
    throw new Error(data?.error || "Cartao recusado. Verifique os dados.");
  }

  return {
    creditCardToken: data.creditCardToken,
    creditCardBrand: data.creditCardBrand ?? null,
    creditCardLast4: data.creditCardLast4 ?? null,
    asaasCustomerId: data.asaasCustomerId,
  };
}
