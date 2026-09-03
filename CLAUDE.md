CLAUDE.md
Contexto e regras para sessões de agentes de IA neste repositório.

Este arquivo cobre o que não fazer e como validar. Para entender o sistema, leia docs/ARCHITECTURE.md; para setup e visão geral, o README.md. Não duplique conteúdo entre os três — cada fato tem um dono.

Projeto: app web mobile-first de aluguel de carros peer-to-peer (OLI). Vite + React 18 + TypeScript, shadcn-ui + Tailwind, Supabase (Postgres/Auth/Storage/Realtime/Edge Functions), n8n externo para CNH, contrato, vistoria e pagamento.


Regra número 1 — preservar o comportamento existente
Este projeto está em produção (https://oli-drive-rent.lovable.app), sincronizado automaticamente com o editor Lovable e possivelmente com deploy/preview na Vercel. Mudanças aqui podem ir para produção sem um passo de revisão manual adicional — trate qualquer alteração de rota, API, env var ou config de build como área crítica.
Regra número 2 — a rede de proteção é quase inexistente
Não existe um único teste automatizado neste repositório. Não existe CI. Nenhum *.test.*, nenhum *.spec.*, nenhum .github/workflows/.

O que existe é lint + typecheck + build, e nenhum dos três testa comportamento — eles pegam erro de sintaxe, tipo e estilo, não pegam um fluxo de pagamento quebrado. Consequências práticas:

Passar no lint/typecheck/build não é evidência de que a mudança funciona. É só evidência de que compila.
Alteração em pagamento, contrato, vistoria ou CNH exige verificação manual no navegador antes de considerar a tarefa concluída. Se você não puder fazer essa verificação, diga isso explicitamente ao entregar.
Na dúvida entre uma mudança elegante e uma mudança pequena, escolha a pequena. Não há rede para amparar refatoração especulativa.


Comandos
npm install                              # instalar deps (NÃO use npm ci)

npm run dev                              # dev server, porta 8080

npm run build                            # build de produção

npm run lint                             # ESLint

npx tsc --noEmit -p tsconfig.app.json    # typecheck

Rode os três (lint, typecheck, build) depois de qualquer alteração e compare com o baseline (ver Baseline de qualidade).

Package manager: npm, com package-lock.json como lockfile oficial. Não troque de package manager. O repo também carrega bun.lock e bun.lockb (resquício de uso anterior do Bun) — não gerencie dependências por eles.


Antes de entregar
npm run dev aponta para o Supabase de produção. Não há projeto de desenvolvimento separado. Ao testar fluxos de reserva, contrato ou pagamento, você está escrevendo no banco real — evite gerar cobranças ou contratos de teste.
Não commite na main sem pedido explícito. O padrão é abrir uma branch. Um push na main é, na prática, um deploy.
Verificação manual por área de risco, quando a mudança tocar:
pagamento / caução → confirmar o modal correspondente em src/components/payments/ e o _webhook_target enviado ao proxy
contrato → estados do ContractViewModal (dados incompletos, aguardando locador, assinado)
vistoria → upload de fotos nas quatro etapas
CNH → DriverLicenseForm e o retorno do webhook
layout → conferir em viewport mobile; o app é mobile-first
Rollback: como não há staging, o caminho de volta é git revert do commit e novo push. Prefira commits pequenos e temáticos justamente por isso.


Mapa rápido
Onde vive cada fluxo. As páginas ficam em src/pages/, as rotas em src/App.tsx, os services em src/lib/.

Fluxo
Página / componente
Service
Integração externa
Auth / onboarding
Auth.tsx, AuthCallback.tsx, Onboarding.tsx
ensureProfile.ts
Supabase Auth
CNH
DriverLicenseForm.tsx
driverLicenseService.ts
n8n /cnhcheck → SERPRO
Cadastro de veículo
RegisterVehicle.tsx, EditVehicle.tsx, MyVehicles.tsx
vehicleService.ts, vehiclePhotoService.ts, addressService.ts
n8n /validarcarro
Busca / detalhe
Search.tsx, VehicleDetails.tsx
supabase.ts (getAvailableVehicles, getVehicleById, getVehiclePhotos)
—
Reserva
BookVehicle.tsx, Reservations.tsx
supabase.ts (createRental, getMyRentalsAs*)
—
Contrato
contracts/ContractViewModal.tsx
contractService.ts
n8n /oli-contrato → Clicksign
Vistoria
VehicleInspection.tsx
inspectionService.ts, inspectionPdfService.ts
n8n /oli-vistoria*
Pagamento / caução
payments/PixPaymentModal.tsx, CardPaymentModal.tsx, AsaasDepositModal.tsx
— (chamam o proxy direto)
n8n /oli/sp/pagar, /oli-caucao-asaas → Asaas
Chat
Messages.tsx, Chat.tsx
chatService.ts
Supabase Realtime
Notificações
notifications/NotificationBell.tsx
notificationService.ts
Edge Function send-notification-email → Resend


Hooks src/hooks/use*Realtime.ts assinam mudanças ao vivo do Supabase (contrato, caução, vistoria, pagamento, fotos de veículo).

Sobre a camada de dados: páginas e componentes consomem src/lib/, não o client Supabase cru — ao mudar uma regra de negócio, comece pelo arquivo de src/lib/. Duas nuances que economizam busca:

src/lib/supabase.ts (~525 linhas) não é só o client: concentra os helpers de veículo, rental e perfil (getAvailableVehicles, getVehicleById, createRental, getMyRentalsAs*, getProfile). É ele que Search, VehicleDetails, BookVehicle e Reservations usam. vehicleService.ts cobre a outra ponta — criação e edição de veículo (RegisterVehicle, EditVehicle, MyVehicles).
Os modais de pagamento fogem do padrão: chamam supabase.functions.invoke("webhook-proxy", …) diretamente, sem service intermediário. Justamente o fluxo mais sensível é o menos padronizado.


Cuidados específicos
Integração com o n8n
webhook-proxy (supabase/functions/webhook-proxy/index.ts) deve ser o único ponto por onde o frontend fala com o n8n. Ao adicionar um fluxo de servidor, registre a URL na whitelist ALLOWED_URLS (hoje com 12 entradas) em vez de chamar o n8n direto do client.
Validação facial: src/components/profile/FaceRecognitionField.tsx já chama o fluxo oli-face-validation via webhook-proxy. O workflow correspondente ainda precisa existir no n8n; até lá o frontend trata falha como não crítica e mantém o status pending.
Os workflows deste repo são um subconjunto. n8n/workflows/ tem apenas os 3 fluxos da caução Asaas. CNH, validação de veículo, contrato, as quatro etapas de vistoria e os fluxos de pagamento vivem só no servidor n8n. A fonte da verdade é o servidor — o repositório pode estar defasado sem nenhum sinal.
A whitelist tem duas entradas apontando para a mesma URL (oli-pagamento-pix e oli-pagamento-cartao → /oli/sp/pagar). É intencional até segunda ordem; não "limpe" isso sem confirmar.
Segredos
Nunca exponha segredos. O .env deste repo está versionado, mas contém apenas a URL e a chave anon/publishable do Supabase (públicas por design, protegidas por RLS). Segredos reais — SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, chaves da Asaas, do SERPRO e da Clicksign — vivem fora deste repo (secrets do Supabase e variáveis de ambiente do n8n). Nunca os adicione aqui, e note que o .gitignore não ignora .env, portanto não há rede de segurança automática.
Dependências
npm ci falha — package-lock.json está fora de sincronia com package.json (falta embla-carousel-autoplay). Use npm install. Não regenere o lockfile "para consertar isso" sem que seja o objetivo explícito da tarefa — é uma mudança de dependências, não trivial.
Não atualize dependências sem pedido explícito, mesmo que existam versões mais novas disponíveis.
Arquivos e estrutura
Alias @/* → src/* (tsconfig*.json + vite.config.ts). Ao mover arquivos, atualize os imports que usam esse alias.
Não mova package.json, vite.config.ts, index.html, vercel.json ou os tsconfig*.json para fora da raiz — Lovable e Vercel esperam a raiz do app na raiz do repositório.
src/integrations/supabase/types.ts é gerado a partir do schema (1.256 linhas). Não edite à mão, mesmo que seja o caminho mais curto para silenciar um erro de tipo — regenere a partir do Supabase.
Migrations: supabase/migrations/ tem 22 arquivos gerados automaticamente (timestamp + UUID). Nunca edite uma migration existente — apenas adicione novas.
CSS: o design system está em src/index.css (cores em HSL, tokens do Tailwind) e é para lá que estilo novo deve ir. Existem três folhas de override em src/styles/: metallic-refresh.css e home-v3.css (importadas em src/main.tsx) e home-spacing-fix.css (carregada por <link rel="stylesheet" href="/src/styles/home-spacing-fix.css"> no index.html). home-spacing-fix.css não aparece em nenhum import e não é órfão — não apague. Não crie uma quarta camada de hotfix.
src/lib/pixPaymentService.ts é código morto — nenhum import, nenhum export usado. Não "corrija bugs de PIX" nele: não muda nada em produção. E não chame simulatePixPaymentConfirmation achando que é o fluxo real.
src/assets/cars/ e src/assets/vehicles/ têm imagens duplicadas, mas ambas estão em uso: cars/ por src/components/landing/CarsCarousel.tsx, vehicles/ por src/pages/Home.tsx e src/pages/VehicleDetails.tsx. Não são arquivos mortos.
.lovable/plan.md é um plano gerado pelo editor Lovable cujas alterações já foram executadas. É histórico, não backlog — não o leia como pendência.
Arquivos grandes — ContractViewModal.tsx (~1.100 linhas), DriverLicenseForm.tsx (~1.100), EditVehicle.tsx (~840). Quebrar em componentes menores seria bom, mas não faça isso de carona numa tarefa que pede outra coisa: pela Regra nº 2, refatoração sem teste é risco puro. Refatore só quando for o objetivo explícito da tarefa.


Baseline de qualidade
O repositório tem erros de lint e typecheck pré-existentes. Eles não são regressão sua.

Última medição: commit 587ef9b (12/08/2026), quando este arquivo foi criado. Não foi remedido desde então.

Lint: ~63 erros / ~32 warnings, majoritariamente no-explicit-any e react-hooks/exhaustive-deps. Há ~65 ocorrências de any espalhadas por 28 arquivos em src/.
Typecheck: erros em src/components/profile/FaceRecognitionField.tsx e src/lib/vehicleService.ts (incompatibilidade com o schema gerado do Supabase).
Build de produção passa (apenas warnings de chunk grande).

Como usar isso: os números acima envelhecem a cada commit e servem só como ordem de grandeza. Antes de alterar qualquer coisa, gere o seu próprio ponto de partida:

npm run lint 2>&1 | tail -5          # baseline antes da sua mudança

npx tsc --noEmit -p tsconfig.app.json

Depois compare. Erros iguais aos do baseline não são regressão — não tente consertá-los de carona. Erros novos e diferentes são regressão e devem ser corrigidos ou revertidos antes de entregar.

Se você mexer numa área que já tinha erro pré-existente e conseguir eliminá-lo sem esforço extra, ótimo. Não faça disso uma tarefa paralela.

