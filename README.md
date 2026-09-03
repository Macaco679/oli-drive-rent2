OLI — Aluguel de Carros Entre Particulares
Plataforma web mobile-first de aluguel de carros peer-to-peer: motoristas de aplicativo (Uber, 99, InDrive) e usuários em geral alugam carros diretamente de proprietários individuais, com cadastro de veículos, validação de CNH, reservas, vistoria fotográfica, contrato digital, chat e pagamento (caução via Asaas).

Status: em produção. Produção: https://oli-drive-rent.lovable.app Editor Lovable: https://lovable.dev/projects/62484da3-78f7-45d7-aa38-c85ebf573d00


Como funciona
O caminho completo de uma locação:

Cadastro e onboarding — Supabase Auth (e-mail/senha). O onboarding define o papel do usuário: renter, owner ou both.
Validação de CNH — o usuário envia os dados da habilitação; um fluxo n8n consulta a base do SERPRO e devolve o resultado.
Cadastro de veículo (proprietário) — dados do carro passam por um fluxo n8n de validação antes de o veículo ficar disponível.
Busca e reserva — o locatário encontra o veículo e cria a reserva.
Contrato digital — gerado via n8n e assinado por ambas as partes na Clicksign. O status volta por webhook.
Vistoria fotográfica — fotos de retirada e devolução, enviadas ao n8n pelo proxy, em quatro etapas (locador/locatário × retirada/devolução).
Pagamento e caução — cobrança via Asaas (PIX, boleto ou cartão), orquestrada pelo n8n.
Devolução — vistoria final e liberação da caução.

Regra estrutural: o frontend nunca chama o n8n diretamente — tudo passa pela Edge Function webhook-proxy, que mantém uma whitelist de endpoints.

Detalhamento em docs/ARCHITECTURE.md.


Stack
Frontend: Vite + React 18 + TypeScript
UI: shadcn-ui (Radix primitives) + Tailwind CSS
Roteamento: React Router
Dados/estado servidor: TanStack Query
Formulários: react-hook-form + zod
Backend: Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)
Automação externa: n8n — CNH (SERPRO), validação de veículo (InfoSimples), contrato (Clicksign), pagamento e caução (Asaas)


⚠️ Antes de clonar: como o deploy funciona
Leia esta seção antes de fazer qualquer commit.

Lovable e GitHub sincronizam nos dois sentidos. Qualquer edição feita no editor Lovable gera um commit aqui (autor lovable-dev); qualquer push para este repositório é refletido de volta no projeto Lovable.
Não existe ambiente de staging. Um commit na main pode chegar à produção sem nenhum passo de revisão manual.
Não existe CI. Nenhum teste automatizado roda antes de publicar (ver Problemas conhecidos).
Existe um vercel.json na raiz com rewrite de SPA (/* → /index.html), indicando um possível deploy/preview alternativo via Vercel.
Não mova package.json, vite.config.ts, index.html, vercel.json nem os tsconfig*.json para fora da raiz — tanto o Lovable quanto a Vercel esperam a raiz do app na raiz do repositório.

Na prática: trate um push nesse repositório como um deploy.


Pré-requisitos
Node.js 18 ou superior
npm (o lockfile oficial é o package-lock.json — ver Problemas conhecidos)


Instalação
git clone https://github.com/Macaco679/oli-drive-rent2.git

cd oli-drive-rent2

npm install

Use npm install, não npm ci — o lockfile está fora de sincronia. Ver Problemas conhecidos.


Configuração
Copie .env.example para .env e preencha com as credenciais do seu projeto Supabase (Project Settings → API no painel do Supabase).

Variável
Onde é usada
Sensibilidade
VITE_SUPABASE_URL
Frontend (import.meta.env)
Pública
VITE_SUPABASE_PROJECT_ID
Frontend
Pública
VITE_SUPABASE_PUBLISHABLE_KEY
Frontend
Pública (chave anon, protegida por RLS)
SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY
Espelho sem prefixo, para scripts
Pública
SUPABASE_SERVICE_ROLE_KEY
Edge Functions (Deno.env.get)
Sensível — secret do Supabase, não vive aqui
RESEND_API_KEY
Edge Function send-notification-email
Sensível — secret do Supabase
ASAAS_API_KEY
Edge Function asaas-tokenize-card
Sensível — secret do Supabase
ASAAS_CAUCAO_API_KEY, ASAAS_API_BASE_URL, ASAAS_WEBHOOK_TOKEN
Workflows n8n
Sensível — ambiente do n8n


Dois avisos importantes:

npm run dev aponta para o Supabase de produção. Não existe um projeto Supabase separado para desenvolvimento. Qualquer dado criado rodando localmente entra no banco real — cuidado especial com fluxos de reserva, contrato e pagamento.
O .env deste repositório está versionado, contendo a URL e a chave anon do projeto (públicas por design, protegidas por Row Level Security). Isso é uma decisão herdada, não um descuido — mas significa que o .gitignore não protege contra um segredo real entrar num commit. Nunca adicione SUPABASE_SERVICE_ROLE_KEY, chaves da Asaas, do SERPRO ou da Clicksign a este arquivo.


Desenvolvimento
npm run dev

Sobe o servidor Vite em http://localhost:8080.
Scripts
Comando
Descrição
npm run dev
Servidor de desenvolvimento (porta 8080)
npm run build
Build de produção
npm run build:dev
Build em modo development (útil para debug)
npm run lint
ESLint
npm run preview
Preview local do build de produção


Typecheck (não tem script próprio):

npx tsc --noEmit -p tsconfig.app.json


Estrutura do projeto
├── src/

│   ├── pages/            # Uma página por rota (22 páginas — ver src/App.tsx)

│   ├── components/       # ui/ (shadcn) + pastas por domínio: chat,

│   │                     # contracts, debug, inspection, landing, layout,

│   │                     # notifications, payments, profile, reservations,

│   │                     # vehicles

│   ├── hooks/            # use*Realtime.ts (contrato, caução, vistoria,

│   │                     # pagamento, fotos) + notificações, toast, mobile

│   ├── contexts/         # DriverLicenseContext, ChatWidgetContext

│   ├── lib/              # Camada de serviços, um arquivo por domínio

│   │                     # (vehicleService, contractService, chatService…)

│   ├── integrations/supabase/  # client.ts + types.ts (GERADO — não editar)

│   ├── styles/           # Overrides de CSS em cima do design system —

│   │                     # ver "Convenções" abaixo

│   └── assets/           # Imagens (cars/, vehicles/, logos/)

├── supabase/

│   ├── config.toml       # project_id + config das Edge Functions

│   ├── migrations/       # 22 migrations (geradas via Lovable/Supabase)

│   └── functions/        # webhook-proxy, send-notification-email

├── n8n/workflows/        # APENAS os 3 fluxos de caução Asaas — ver abaixo

├── docs/ARCHITECTURE.md  # Arquitetura e fluxos em detalhe

├── public/               # Assets estáticos (inclui 49 MB de vídeo)

├── .lovable/plan.md      # Plano gerado pelo editor Lovable (histórico)

└── vercel.json           # Rewrite de SPA


Backend e automação
Supabase é gerenciado pelo fluxo Lovable/Supabase, não por CLI local. As migrations em supabase/migrations/ são geradas automaticamente (timestamp

UUID). Não edite migrations existentes — apenas adicione novas.

Edge Functions (supabase/functions/):

webhook-proxy — ponto de saída do frontend para o n8n. Mantém a whitelist ALLOWED_URLS, evitando CORS e mantendo as URLs do n8n fora do bundle do cliente. Novo fluxo de servidor → registre a URL aqui. Os logs do proxy devem registrar apenas destino, status, tamanho da resposta e payload redigido.
asaas-tokenize-card — tokeniza cartão na Asaas antes de chamar o n8n. O n8n recebe somente o token, não número completo/CVV.
send-notification-email — e-mails transacionais via Resend.

webhook-proxy e send-notification-email rodam com verify_jwt = false (ver supabase/config.toml). asaas-tokenize-card roda com verify_jwt = true.

n8n roda num servidor externo. Atenção:

A pasta n8n/workflows/ contém apenas os 3 fluxos da caução via Asaas (create, callback, release). O servidor n8n roda um conjunto bem maior de fluxos — CNH, validação de veículo, contrato, as quatro etapas de vistoria e os fluxos de pagamento — que não estão versionados aqui. A fonte da verdade dos workflows é o servidor n8n; alterações feitas lá não geram commit neste repositório.

Ver n8n/workflows/README-oli-caucao-asaas.md para o fluxo de caução.


Convenções
Alias @/* → src/* (configurado em tsconfig*.json e vite.config.ts), usado em praticamente todos os imports internos.

Variáveis de ambiente do frontend usam o prefixo VITE_, exigido pelo Vite para exposição ao client-side.

Design system em src/index.css — cores em HSL, tokens do Tailwind. Estilo novo deve ir para lá. Existem três folhas de override em src/styles/ (metallic-refresh.css e home-v3.css, importadas em src/main.tsx; home-spacing-fix.css, carregada por <link> no index.html). home-spacing-fix.css não aparece em nenhum import — não é arquivo órfão. Evite criar uma quarta camada de hotfix.

src/integrations/supabase/types.ts é gerado a partir do schema do banco. Não edite à mão.

Assets duplicados: src/assets/cars/ e src/assets/vehicles/ têm imagens em boa parte idênticas, mas as duas pastas estão em uso:

src/assets/cars/ → src/components/landing/CarsCarousel.tsx
src/assets/vehicles/ → src/pages/Home.tsx, src/pages/VehicleDetails.tsx

Não são arquivos mortos. Consolidar é possível, mas exige atualizar imports e conferir visualmente o carrossel da landing e os cards.


Problemas conhecidos
Lista honesta do que está pendente. Nenhum destes itens é regressão recente.

Não há testes automatizados nem CI. Nenhum *.test.*, nenhum .github/workflows/. lint + typecheck + build é toda a verificação que existe — e nenhum dos três testa comportamento. Mudanças em pagamento, contrato ou vistoria exigem teste manual no navegador.
npm ci falha — package-lock.json está fora de sincronia com package.json (embla-carousel-autoplay@8.6.0 presente no package.json, ausente do lockfile). Use npm install. Regenerar o lockfile é uma mudança de dependências e deve ser tarefa própria, testada contra o build do Lovable/Vercel.
Três lockfiles no repo — package-lock.json (oficial), bun.lock e bun.lockb (resquício de uso anterior do Bun; não gerencie dependências por eles).
.env versionado — ver Configuração.
Validação facial depende do workflow oli-face-validation existir no n8n. O frontend já chama esse fluxo via webhook-proxy; se o workflow ainda não existir no n8n, o status fica pendente.
src/lib/pixPaymentService.ts é código morto — nenhum arquivo o importa e nenhum dos seus exports é usado. O PIX real acontece em src/components/payments/PixPaymentModal.tsx, que chama o webhook-proxy diretamente. Cuidado: o arquivo contém uma função simulatePixPaymentConfirmation.
49 MB de vídeo em public/videos/ — servidos direto do bundle, pesando no carregamento inicial de um app cujo público é mobile. Mover para CDN/Storage é uma melhoria clara.
Erros de lint e typecheck pré-existentes — o baseline está documentado em CLAUDE.md.
Sem licença — repositório público sem LICENSE, o que na prática significa "todos os direitos reservados".


Documentação relacionada
Arquivo
Conteúdo
docs/ARCHITECTURE.md
Como o sistema funciona por dentro: camadas, modelo de dados, integrações
CLAUDE.md
Regras operacionais para agentes de IA: o que não fazer e como validar
n8n/workflows/README-oli-caucao-asaas.md
Fluxo de caução via Asaas


