import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TokenizeRequest {
  cliente?: {
    nome?: string;
    email?: string;
    cpf?: string;
    celular?: string;
  };
  cartao?: {
    holderName?: string;
    number?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
  };
}

const digitsOnly = (value: unknown): string => String(value || "").replace(/\D/g, "");

const jsonResponse = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const getClientIp = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "127.0.0.1";
};

const asaasFetch = async (
  path: string,
  options: RequestInit,
  apiBaseUrl: string,
  apiKey: string,
): Promise<Response> => {
  return fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "access_token": apiKey,
      ...(options.headers || {}),
    },
  });
};

const findOrCreateCustomer = async (
  cliente: Required<NonNullable<TokenizeRequest["cliente"]>>,
  apiBaseUrl: string,
  apiKey: string,
): Promise<string> => {
  const cpfCnpj = digitsOnly(cliente.cpf);
  const existingResponse = await asaasFetch(
    `/customers?cpfCnpj=${encodeURIComponent(cpfCnpj)}`,
    { method: "GET" },
    apiBaseUrl,
    apiKey,
  );

  if (existingResponse.ok) {
    const existing = await existingResponse.json();
    const customerId = existing?.data?.[0]?.id;
    if (customerId) return customerId;
  }

  const createResponse = await asaasFetch(
    "/customers",
    {
      method: "POST",
      body: JSON.stringify({
        name: cliente.nome,
        email: cliente.email,
        cpfCnpj,
        mobilePhone: digitsOnly(cliente.celular),
      }),
    },
    apiBaseUrl,
    apiKey,
  );

  const created = await createResponse.json().catch(() => null);

  if (!createResponse.ok || !created?.id) {
    console.error("ASAAS_TOKENIZE customer_error", {
      status: createResponse.status,
      errors: created?.errors || "[unavailable]",
    });
    throw new Error("Nao foi possivel preparar o cliente para tokenizacao.");
  }

  return created.id;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Metodo nao permitido." }, 405);
  }

  const apiKey = Deno.env.get("ASAAS_CAUCAO_API_KEY") || Deno.env.get("ASAAS_API_KEY");
  const apiBaseUrl = Deno.env.get("ASAAS_API_BASE_URL") || "https://api.asaas.com/v3";

  if (!apiKey) {
    console.error("ASAAS_TOKENIZE missing_api_key");
    return jsonResponse({ ok: false, error: "Tokenizacao indisponivel." }, 500);
  }

  try {
    const body = (await req.json()) as TokenizeRequest;
    const cliente = body.cliente;
    const cartao = body.cartao;

    const errors: string[] = [];
    if (!cliente?.nome) errors.push("cliente.nome");
    if (!cliente?.email) errors.push("cliente.email");
    if (digitsOnly(cliente?.cpf).length !== 11) errors.push("cliente.cpf");
    if (digitsOnly(cliente?.celular).length < 10) errors.push("cliente.celular");
    if (!cartao?.holderName) errors.push("cartao.holderName");
    if (digitsOnly(cartao?.number).length < 13) errors.push("cartao.number");
    if (digitsOnly(cartao?.expiryMonth).length < 1) errors.push("cartao.expiryMonth");
    if (digitsOnly(cartao?.expiryYear).length < 2) errors.push("cartao.expiryYear");
    if (digitsOnly(cartao?.cvv).length < 3) errors.push("cartao.cvv");

    if (errors.length) {
      return jsonResponse({ ok: false, error: "Dados invalidos para tokenizacao.", fields: errors }, 400);
    }

    const customerId = await findOrCreateCustomer(
      cliente as Required<NonNullable<TokenizeRequest["cliente"]>>,
      apiBaseUrl,
      apiKey,
    );

    const tokenizeResponse = await asaasFetch(
      "/creditCard/tokenizeCreditCard",
      {
        method: "POST",
        body: JSON.stringify({
          customer: customerId,
          creditCard: {
            holderName: cartao!.holderName,
            number: digitsOnly(cartao!.number),
            expiryMonth: digitsOnly(cartao!.expiryMonth).padStart(2, "0"),
            expiryYear: String(cartao!.expiryYear),
            ccv: digitsOnly(cartao!.cvv),
          },
          creditCardHolderInfo: {
            name: cliente!.nome,
            email: cliente!.email,
            cpfCnpj: digitsOnly(cliente!.cpf),
            mobilePhone: digitsOnly(cliente!.celular),
          },
          remoteIp: getClientIp(req),
        }),
      },
      apiBaseUrl,
      apiKey,
    );

    const tokenized = await tokenizeResponse.json().catch(() => null);

    if (!tokenizeResponse.ok || !tokenized?.creditCardToken) {
      console.error("ASAAS_TOKENIZE tokenize_error", {
        status: tokenizeResponse.status,
        errors: tokenized?.errors || "[unavailable]",
      });
      return jsonResponse({ ok: false, error: "Cartao recusado. Verifique os dados." }, 400);
    }

    console.log("ASAAS_TOKENIZE success", {
      customer: customerId,
      brand: tokenized.creditCardBrand || null,
      last4: tokenized.creditCardNumber || tokenized.creditCardLast4 || null,
    });

    return jsonResponse({
      ok: true,
      creditCardToken: tokenized.creditCardToken,
      creditCardBrand: tokenized.creditCardBrand || null,
      creditCardLast4: tokenized.creditCardNumber || tokenized.creditCardLast4 || null,
      asaasCustomerId: customerId,
    });
  } catch (error) {
    console.error("ASAAS_TOKENIZE unexpected_error", error);
    return jsonResponse({ ok: false, error: "Nao foi possivel tokenizar o cartao." }, 500);
  }
});
