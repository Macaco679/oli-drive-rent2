Arquitetura — OLI Drive Rent
Como o sistema funciona por dentro. Para setup e visão geral, ver ../README.md; para regras operacionais de agentes de IA, ../CLAUDE.md.
Visão geral
Aplicação single-page (Vite + React) que fala diretamente com o Supabase para a maior parte dos dados (Postgres + Auth + Storage + Realtime), e delega a um servidor n8n externo os fluxos que precisam de lógica de servidor ou integração com terceiros: validação de CNH, validação de veículo, geração de contrato, vistoria e processamento de pagamento/caução.

O frontend deve falar com o n8n apenas através de uma Edge Function do Supabase que funciona como proxy com whitelist.

┌──────────────┐        ┌──────────────────────────┐       ┌───────────────┐

│  Frontend    │───────▶│ Supabase                 │       │ n8n (externo) │

│ (Vite/React) │        │  - Postgres (oli_*)      │       │  - webhooks   │

│              │◀───────│  - Auth                  │       │               │

│              │        │  - Storage (fotos)       │◀─────▶│               │

│              │        │  - Realtime              │       └───────┬───────┘

│              │        │  - Edge Functions:       │               │

│              │───────▶│      webhook-proxy       │──────▶ whitelist

│              │        │      send-notification-  │               │

└──────────────┘        │      email               │               ▼

                        └──────────────────────────┘   SERPRO · InfoSimples

                                                       Clicksign · Asaas
Frontend
Roteamento centralizado em src/App.tsx (React Router), uma página por rota em src/pages/ — 22 páginas.
Camada de acesso a dados isolada em src/lib/, um arquivo por domínio: contratos, chat, CNH, vistoria, notificações, PDFs, endereços. As páginas e componentes consomem esses módulos em vez de usar o client Supabase cru — ao alterar uma regra de negócio, comece por eles.
src/lib/supabase.ts vai além de inicializar o client: concentra os helpers de leitura de veículo, rental e perfil usados por Search, VehicleDetails, BookVehicle e Reservations. src/lib/vehicleService.ts cobre a escrita — criação e edição de veículo.
Exceção: os modais em src/components/payments/ chamam supabase.functions.invoke("webhook-proxy", …) diretamente, sem passar por um service.
Código morto: src/lib/pixPaymentService.ts não é importado por nenhum arquivo e nenhum de seus exports é usado. O PIX real acontece em PixPaymentModal.tsx.
Hooks em src/hooks/use*Realtime.ts assinam mudanças em tempo real (Supabase Realtime) para contrato, caução, vistoria, pagamento e fotos de veículo — usados para refletir aprovações e mudanças de status sem reload.
src/integrations/supabase/client.ts inicializa o client a partir de VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. O types.ts ao lado é gerado a partir do schema do banco — não editar à mão.
Estilo: design system em src/index.css (cores em HSL, tokens do Tailwind), com três folhas de override em src/styles/. Duas são importadas em src/main.tsx; home-spacing-fix.css é carregada por <link> no index.html e por isso não aparece em buscas por import.
Autenticação
Supabase Auth (e-mail/senha). Após o cadastro, um registro correspondente é criado/atualizado em oli_profiles (ver src/lib/ensureProfile.ts). O onboarding (src/pages/Onboarding.tsx) coleta dados adicionais e o papel do usuário (renter / owner / both).
Modelo de dados (Supabase/Postgres)
Tabelas principais, todas com prefixo oli_:

oli_profiles — perfil do usuário (nome, CPF, telefone, papel)
oli_vehicles — veículos cadastrados (preços, localização, status)
oli_vehicle_photos — fotos por veículo (bucket de Storage vehicle-photos)
oli_rentals — reservas (locador ↔ locatário, datas, valores, status)
oli_payments — cobranças e caução (atualizada por callback do n8n)

O schema cobre ainda vistoria (fotos de retirada/devolução), contratos digitais e notificações — refletidas nas 22 migrations em supabase/migrations/, nomeadas por timestamp + UUID e geradas automaticamente pelo fluxo Lovable/Supabase. Não editar migrations existentes; apenas adicionar novas.

Superfície de segurança: como a chave anon é pública por design, toda a proteção dos dados depende das políticas de Row Level Security das tabelas oli_*. É o único perímetro que existe — uma revisão dedicada dessas policies é a tarefa de segurança de maior retorno neste projeto.
Edge Functions (supabase/functions/)
Configuração em supabase/config.toml. webhook-proxy e send-notification-email rodam com verify_jwt = false; asaas-tokenize-card roda com verify_jwt = true.
webhook-proxy
Ponto de saída do frontend para o n8n. Mantém a whitelist ALLOWED_URLS com as integrações permitidas — validação de veículo, CNH, vistoria, geração de contrato, validação facial, cobrança PIX/cartão e caução via Asaas — e repassa a requisição, evitando CORS e mantendo as URLs do n8n fora do bundle do cliente. Suporta application/json e multipart/form-data (upload de fotos de vistoria), com o destino escolhido pelo campo _webhook_target. Os logs redigem campos sensíveis e não registram corpo completo de resposta do n8n.

Para adicionar um novo fluxo de servidor, registre a URL aqui em vez de chamar o n8n diretamente do frontend.

Duas entradas apontam para a mesma URL (oli-pagamento-pix e oli-pagamento-cartao → /oli/sp/pagar); é intencional até segunda ordem.
asaas-tokenize-card
Tokeniza cartão na Asaas antes de enviar o pagamento ao n8n. O frontend envia número completo/CVV apenas para esta Edge Function autenticada; o n8n recebe somente creditCardToken e asaasCustomerId.
send-notification-email
Envio de e-mails transacionais via Resend (RESEND_API_KEY, configurado como secret do Supabase — não vive neste repositório).
n8n e integrações externas
Os workflows rodam num servidor n8n externo a este repositório e integram:

Integração
Uso
SERPRO DataValid
Validação de CNH e CPF
InfoSimples
Consulta de dados de veículo
Clicksign
Contrato digital e assinatura
Asaas
PIX, boleto, cartão e caução


n8n/workflows/ contém apenas um subconjunto. Estão versionados aqui só os 3 fluxos da caução via Asaas (create, callback, release). Os fluxos de CNH, validação de veículo, contrato, vistoria e pagamento existem apenas no servidor. A fonte da verdade é o servidor n8n — alterações feitas lá não geram commit aqui, e o repositório pode estar defasado sem nenhum sinal visível.

Os workflows versionados usam variáveis de ambiente do próprio n8n (ASAAS_CAUCAO_API_KEY, ASAAS_API_BASE_URL, ASAAS_WEBHOOK_TOKEN, SUPABASE_SERVICE_ROLE_KEY), referenciadas como {{$env.NOME}} dentro do JSON exportado — essas credenciais não estão neste repositório. Ver n8n/workflows/README-oli-caucao-asaas.md para o detalhamento do fluxo.
Variáveis de ambiente
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
SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
Espelho sem prefixo
Pública
SUPABASE_SERVICE_ROLE_KEY
Edge Functions (Deno.env.get) e n8n
Sensível — secret do Supabase
RESEND_API_KEY
Edge Function send-notification-email
Sensível — secret do Supabase
ASAAS_API_KEY
Edge Function asaas-tokenize-card
Sensível — secret do Supabase
ASAAS_CAUCAO_API_KEY, ASAAS_API_BASE_URL, ASAAS_WEBHOOK_TOKEN
Workflows n8n
Sensível — ambiente do n8n


O .env deste repositório está versionado e contém apenas as variáveis públicas. Isso é uma decisão herdada, não um descuido — mas o .gitignore não ignora .env, então nada impede que um segredo real entre num commit por distração.

Não existe projeto Supabase separado para desenvolvimento: rodar npm run dev conecta na base de produção.
Duplicação conhecida de assets
src/assets/cars/ e src/assets/vehicles/ têm várias imagens idênticas (mesmo conteúdo, nomes ligeiramente diferentes), mas ambas as pastas estão em uso:

src/assets/cars/ → src/components/landing/CarsCarousel.tsx
src/assets/vehicles/ → src/pages/Home.tsx, src/pages/VehicleDetails.tsx

Consolidar é seguro em teoria, mas exige atualizar os imports e conferir visualmente o carrossel da landing e os cards de veículo.
Build e deploy
Build: Vite (npm run build) gera dist/ (ignorado pelo git).
Deploy principal: Lovable (Share → Publish), com sincronização bidirecional GitHub ↔ Lovable. Editar no Lovable gera commit aqui; push aqui reflete no Lovable.
vercel.json na raiz sugere um deploy/preview alternativo via Vercel (rewrite de SPA /* → /index.html).
Ambos os caminhos esperam a raiz do app na raiz do repositório — não mover package.json, vite.config.ts, index.html ou vercel.json para subpastas.
Não há ambiente de staging e não há CI. Nenhum teste automatizado roda antes de publicar.
Pendências conhecidas
Lockfile fora de sincronia — embla-carousel-autoplay@8.6.0 está no package.json mas ausente do package-lock.json, o que faz npm ci falhar (npm install funciona). O repositório também carrega três lockfiles: package-lock.json (oficial), bun.lock e bun.lockb. Regenerar lockfiles é uma mudança de dependências e deve ser feita deliberadamente, testando o impacto no pipeline Lovable/Vercel antes de commitar.
Workflow oli-face-validation ainda precisa existir no n8n para a validação facial sair de pending.
49 MB de vídeo em public/videos/ — servidos direto do bundle, pesando no carregamento inicial de um app mobile-first. Mover para CDN/Storage é a otimização de maior impacto no tempo de carga.
Ausência de testes e CI — nenhuma verificação de comportamento entre o commit e a produção.
RLS não auditada — ver a nota em Modelo de dados.

