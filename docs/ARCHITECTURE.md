# Arquitetura — OLI Drive Rent

## Visão geral

Aplicação single-page (Vite + React) que fala diretamente com Supabase para
a maior parte dos dados (Postgres + Auth + Storage + Realtime), e delega a
um servidor n8n externo os fluxos que precisam de lógica de servidor ou
integração com terceiros (validação de CNH, geração de contrato,
processamento de caução via Asaas). O frontend nunca chama o n8n
diretamente — todas as chamadas passam por uma Edge Function do Supabase
que funciona como proxy.

```
┌─────────────┐        ┌───────────────────────┐        ┌──────────────┐
│  Frontend    │──────▶│ Supabase                │        │ n8n (externo) │
│  (Vite/React)│        │ - Postgres (oli_*)      │        │ - webhooks    │
│              │◀──────│ - Auth                  │        │ - Asaas API   │
│              │        │ - Storage (fotos)       │◀──────│               │
│              │        │ - Realtime              │───────▶│               │
│              │        │ - Edge Functions:       │        └──────────────┘
│              │──────▶│   webhook-proxy          │──────▶ (whitelist de URLs)
│              │        │   send-notification-email│
└─────────────┘        └───────────────────────┘
```

## Frontend

- Roteamento centralizado em `src/App.tsx` (React Router), uma página por
  rota em `src/pages/`.
- Camada de acesso a dados isolada em `src/lib/*Service.ts` (um arquivo por
  domínio: veículos, contratos, chat, CNH, vistoria, pagamento PIX,
  notificações, PDFs). As páginas/componentes consomem esses services em vez
  de chamar o Supabase diretamente — ao alterar uma regra de negócio,
  comece por esse arquivo.
- Hooks em `src/hooks/use*Realtime.ts` assinam mudanças em tempo real
  (Supabase Realtime) para contrato, caução, vistoria, pagamento e fotos de
  veículo — usados para refletir aprovações/mudanças de status sem reload.
- `src/integrations/supabase/client.ts` inicializa o client Supabase a
  partir das variáveis `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`.
  `types.ts` são tipos gerados a partir do schema do banco.

## Autenticação

Supabase Auth (e-mail/senha). Após cadastro, um registro correspondente é
criado/atualizado em `oli_profiles`. Fluxo de onboarding
(`src/pages/Onboarding.tsx`) coleta dados adicionais e o papel do usuário
(`renter` / `owner` / `both`).

## Modelo de dados (Supabase/Postgres)

Tabelas principais com prefixo `oli_`:

- `oli_profiles` — perfil do usuário (nome, CPF, telefone, papel)
- `oli_vehicles` — veículos cadastrados (preços, localização, status)
- `oli_vehicle_photos` — fotos por veículo (bucket de Storage)
- `oli_rentals` — reservas (locador ↔ motorista, datas, valores, status)

Além dessas, o schema cobre vistoria (fotos de retirada/devolução),
contratos digitais, pagamentos e caução — refletidas nas 21 migrations em
`supabase/migrations/` (nomeadas por timestamp + UUID, geradas
automaticamente pelo fluxo Lovable/Supabase; não editar migrations antigas,
apenas adicionar novas).

## Edge Functions (`supabase/functions/`)

- **`webhook-proxy`** — único ponto de saída do frontend para o n8n.
  Mantém uma whitelist (`ALLOWED_URLS`) de endpoints permitidos
  (validação de veículo, CNH, vistoria, geração de contrato, cobrança
  PIX/cartão, caução via Asaas) e repassa a requisição, evitando problemas
  de CORS e evitando expor as URLs do n8n diretamente no bundle do client.
  Para adicionar um novo fluxo de servidor, adicione a URL aqui em vez de
  chamar o n8n diretamente do frontend.
- **`send-notification-email`** — envio de e-mails transacionais (usa
  `RESEND_API_KEY`, configurado como secret do Supabase — não vive neste
  repositório).

## n8n + Asaas (caução)

`n8n/workflows/` contém a exportação dos workflows relacionados à caução:
criação da cobrança, callback de confirmação e liberação do valor. Esses
workflows rodam num servidor n8n separado (fora deste repositório) e usam
variáveis de ambiente do próprio n8n (`ASAAS_CAUCAO_API_KEY`,
`ASAAS_API_BASE_URL`, `ASAAS_WEBHOOK_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`) —
essas credenciais **não** estão neste repositório, apenas referenciadas
como `{{$env.NOME_DA_VARIAVEL}}` dentro do JSON exportado. Ver
`n8n/workflows/README-oli-caucao-asaas.md` para o detalhamento do fluxo.

## Variáveis de ambiente

| Variável                          | Onde é usada                    | Sensibilidade |
|-----------------------------------|----------------------------------|----------------|
| `VITE_SUPABASE_URL`               | Frontend (`import.meta.env`)     | Pública        |
| `VITE_SUPABASE_PUBLISHABLE_KEY`   | Frontend (`import.meta.env`)     | Pública (chave anon, protegida por RLS) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions (`Deno.env.get`) | **Sensível** — não fica neste repo, é secret do Supabase |
| `RESEND_API_KEY`                  | Edge Function `send-notification-email` | **Sensível** — secret do Supabase |
| `ASAAS_CAUCAO_API_KEY`, `ASAAS_API_BASE_URL`, `ASAAS_WEBHOOK_TOKEN` | Workflows n8n | **Sensível** — vive no ambiente do n8n |

O `.env` deste repositório contém apenas as duas primeiras (públicas por
design do Supabase — protegidas por Row Level Security, não por sigilo da
chave). Nenhuma credencial sensível foi encontrada versionada no
repositório.

## Duplicação conhecida de assets (não resolvida nesta reorganização)

`src/assets/cars/` e `src/assets/vehicles/` têm várias imagens idênticas
(mesmo conteúdo, nomes ligeiramente diferentes), mas **ambas as pastas
estão em uso**:

- `src/assets/cars/` → `src/components/landing/CarsCarousel.tsx`
- `src/assets/vehicles/` → `src/components/vehicles/VehicleCard.tsx`,
  `src/pages/VehicleDetails.tsx`

Consolidar essas pastas é seguro em teoria, mas exige atualizar imports em
3 arquivos e conferir visualmente o carrossel da landing e os cards de
veículo — não foi feito nesta tarefa por ser uma mudança de estrutura de
código (não um artefato órfão), fora do escopo de "organização segura".
Ver seção de melhorias futuras no relatório da auditoria.

## Build/deploy

- Build: Vite (`npm run build`) gera `dist/` (ignorado pelo git).
- Deploy principal: Lovable (Share → Publish), com sincronização
  bidirecional GitHub ↔ Lovable.
- `vercel.json` na raiz sugere um possível deploy/preview alternativo via
  Vercel (rewrite de SPA `/* → /index.html`). Ambos os caminhos de deploy
  esperam a raiz do app na raiz do repositório — não mover `package.json`,
  `vite.config.ts`, `index.html` ou `vercel.json` para subpastas.

## Pendência conhecida: lockfile fora de sincronia

`package-lock.json` está dessincronizado de `package.json`
(`embla-carousel-autoplay@8.6.0` presente em `package.json` mas ausente do
lockfile), o que faz `npm ci` falhar — `npm install` funciona normalmente.
O repositório também carrega três lockfiles: `package-lock.json` (npm),
`bun.lock` (texto, atualizado) e `bun.lockb` (binário, desatualizado desde
nov/2025). Isso não foi alterado nesta reorganização — regenerar lockfiles
é uma mudança de dependências, fora do escopo de "organização segura", e
deve ser feita deliberadamente em uma tarefa própria, testando o impacto no
pipeline de build da Lovable/Vercel antes de commitar.
