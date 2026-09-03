import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Host do servidor n8n.
//
// ATENCAO: o servidor antigo (n8n.srv1153225.hstgr.cloud) foi desativado e
// nem resolve mais em DNS. Enquanto a whitelist apontava para ele, TODAS as
// integracoes de servidor ficaram fora do ar - CNH, validacao de veiculo,
// contrato, as quatro etapas de vistoria e os pagamentos.
//
// O host fica isolado nesta constante justamente para que uma proxima
// migracao de servidor seja uma linha, e nao doze.
const N8N_BASE = "https://n8n-gurh.srv1643933.hstgr.cloud";

// Allowed webhook destinations (whitelist for security)
const ALLOWED_URLS: Record<string, string> = {
  "validarcarro": `${N8N_BASE}/webhook/validarcarro`,
  "oli-contrato": `${N8N_BASE}/webhook/oli-contrato`,
  "cnhcheck": `${N8N_BASE}/webhook/cnhcheck`,
  "oli-vistoria-validar": `${N8N_BASE}/webhook/oli-vistoria-validar`,
  "oli-vistoria": `${N8N_BASE}/webhook/oli-vistoria`,
  "oli-asaas-criar-cobranca": `${N8N_BASE}/webhook/oli-asaas-criar-cobranca`,
  "oli-caucao-asaas": `${N8N_BASE}/webhook/oli-caucao-asaas`,
  "oli-pagamento-pix": `${N8N_BASE}/webhook/oli/sp/pagar`,
  "oli-pagamento-cartao": `${N8N_BASE}/webhook/oli/sp/pagar`,
  "oli-vistoria-locatario-retirada": `${N8N_BASE}/webhook/oli-vistoria-locatário-retirada`,
  "oli-vistoria-locatario-devolucao": `${N8N_BASE}/webhook/oli-vistoria-locatário-devolucao`,
  "oli-vistoria-locador-final": `${N8N_BASE}/webhook/oli-vistoria-locador-final`,
  // Validacao facial. O workflow correspondente ainda NAO existe no n8n -
  // a chamada vai retornar 404 ate ele ser criado. O frontend trata isso
  // como nao-critico (o status fica "pending"), mas a rota entra aqui para
  // que a URL do n8n saia do bundle do cliente.
  "oli-face-validation": `${N8N_BASE}/webhook/oli-face-validation`,
};

const SENSITIVE_KEY_PATTERN = /(card|cartao|cartão|cvv|ccv|token|authorization|apikey|api_key|secret|password|senha|cpf|cnpj|rg|license|cnh|renavam|phone|telefone|celular|email|url|image|photo|foto|selfie|payload)/i;

const redactValue = (key: string, value: unknown): unknown => {
  if (SENSITIVE_KEY_PATTERN.test(key)) return "[REDACTED]";

  if (Array.isArray(value)) {
    return `[Array(${value.length})]`;
  }

  if (value && typeof value === "object") {
    return redactObject(value as Record<string, unknown>);
  }

  if (typeof value === "string" && value.length > 80) {
    return `${value.slice(0, 20)}...[truncated:${value.length}]`;
  }

  return value;
};

const redactObject = (input: Record<string, unknown>): Record<string, unknown> => {
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    output[key] = redactValue(key, value);
  }

  return output;
};

const summarizeFormField = (key: string, value: FormDataEntryValue): string => {
  if (value instanceof File) {
    return `${key} (File: ${value.name || "[unnamed]"}, ${value.size} bytes, ${value.type || "application/octet-stream"})`;
  }

  if (SENSITIVE_KEY_PATTERN.test(key)) return `${key}: [REDACTED]`;

  const stringValue = String(value);
  return `${key}: ${stringValue.length > 80 ? `${stringValue.slice(0, 20)}...[truncated:${stringValue.length}]` : stringValue}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // Handle multipart/form-data (for inspection photo uploads)
    if (contentType.includes("multipart/form-data")) {
      const incomingForm = await req.formData();
      const targetKey = incomingForm.get("_webhook_target") as string | null;
      const targetUrl = targetKey ? ALLOWED_URLS[targetKey] : null;

      if (!targetUrl) {
        return new Response(
          JSON.stringify({ error: `Webhook target "${targetKey}" not allowed` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Reconstruct FormData with fresh File objects to avoid Deno forwarding issues
      const outgoing = new FormData();
      const fieldNames: string[] = [];
      let payloadObj: Record<string, unknown> | null = null;
      let inspectionId: string | null = null;

      for (const [key, value] of incomingForm.entries()) {
        if (key === "_webhook_target") continue; // skip routing field

        if (value instanceof File) {
          // Re-read file content to ensure binary data is preserved
          const arrayBuffer = await value.arrayBuffer();
          const newFile = new File([arrayBuffer], value.name, { type: value.type || "application/octet-stream" });
          outgoing.append(key, newFile, value.name);
          fieldNames.push(`${key} (File: ${value.name}, ${newFile.size} bytes, ${value.type})`);
        } else {
          const stringValue = String(value);

          if (key === "inspection_id" && stringValue.trim()) {
            inspectionId = stringValue.trim();
          }

          if (key === "payload") {
            try {
              const parsed = JSON.parse(stringValue);
              if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                payloadObj = parsed as Record<string, unknown>;
                if (typeof payloadObj.inspection_id === "string" && payloadObj.inspection_id.trim()) {
                  inspectionId = payloadObj.inspection_id.trim();
                }
              }
            } catch {
              // keep as string if not valid JSON
            }
          }

          outgoing.append(key, stringValue);
          fieldNames.push(summarizeFormField(key, stringValue));
        }
      }

      // Keep inspection_id redundant in BOTH places (payload + standalone field)
      if (payloadObj && !payloadObj.inspection_id && inspectionId) {
        payloadObj.inspection_id = inspectionId;
        outgoing.delete("payload");
        outgoing.append("payload", JSON.stringify(payloadObj));
      }

      if (!inspectionId && payloadObj?.inspection_id && typeof payloadObj.inspection_id === "string") {
        inspectionId = payloadObj.inspection_id.trim();
      }

      if (inspectionId && !incomingForm.get("inspection_id")) {
        outgoing.append("inspection_id", inspectionId);
        fieldNames.push(`inspection_id: ${inspectionId}`);
      }

      // Only require inspection_id for inspection-related webhooks
      const inspectionTargets = ["oli-vistoria", "oli-vistoria-validar", "oli-vistoria-locatario-retirada", "oli-vistoria-locatario-devolucao", "oli-vistoria-locador-final"];
      if (!inspectionId && inspectionTargets.includes(targetKey || "")) {
        return new Response(
          JSON.stringify({ error: "inspection_id ausente no multipart/form-data" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`WEBHOOK_PROXY multipart target=${targetKey} inspection_id=${inspectionId || "[missing]"} fields=${fieldNames.join(" | ")}`);

      const n8nResponse = await fetch(targetUrl, {
        method: "POST",
        body: outgoing,
      });

      const responseText = await n8nResponse.text();
      console.log(`WEBHOOK_PROXY multipart target=${targetKey} status=${n8nResponse.status} response_bytes=${responseText.length}`);

      return new Response(responseText, {
        status: n8nResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle JSON requests (original behavior)
    const body = await req.json();
    
    const targetKey = body._webhook_target as string | undefined;
    const targetUrl = targetKey ? ALLOWED_URLS[targetKey] : null;

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: `Webhook target "${targetKey || "[missing]"}" not allowed` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { _webhook_target, ...payload } = body;

    console.log(`WEBHOOK_PROXY json target=${targetKey} payload=${JSON.stringify(redactObject(payload))}`);

    const n8nResponse = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await n8nResponse.text();
    console.log(`WEBHOOK_PROXY json target=${targetKey} status=${n8nResponse.status} response_bytes=${responseText.length}`);

    return new Response(responseText, {
      status: n8nResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao comunicar com serviço externo", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
