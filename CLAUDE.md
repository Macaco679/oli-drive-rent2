# CLAUDE.md

Contexto para sessões futuras do Claude Code neste repositório.

## Projeto

App web mobile-first de aluguel de carros peer-to-peer (OLI). Vite + React
18 + TypeScript, shadcn-ui + Tailwind, Supabase (Postgres/Auth/Storage/
Realtime/Edge Functions), integração externa com n8n + Asaas para caução.
Detalhes completos em `docs/ARCHITECTURE.md`.

## Regra número 1

**Preservar o comportamento existente.** Este projeto está em produção
(https://oli-drive-rent.lovable.app), sincronizado automaticamente com o
editor Lovable e possivelmente com deploy/preview na Vercel. Mudanças aqui
podem ir para produção sem um passo de revisão manual adicional — trate
qualquer alteração de rota, API, env var ou config de build como área
crítica.

## Comandos

- `npm install` — instalar dependências (**não** use `npm ci`, veja
  "Cuidados" abaixo)
- `npm run dev` — dev server, porta 8080
- `npm run build` — build de produção
- `npm run lint` — ESLint
- `npx tsc --noEmit -p tsconfig.app.json` — typecheck

Rode lint + typecheck + build depois de qualquer alteração para comparar
com o baseline conhecido (ver "Erros pré-existentes" abaixo).

## Package manager

**npm**, com `package-lock.json` como lockfile oficial. Não troque de
package manager. O repo também carrega `bun.lock`/`bun.lockb` (resquício de
uso anterior do Bun) — não gerencie dependências por eles.

## Cuidados específicos

- **`npm ci` falha** — `package-lock.json` está fora de sincronia com
  `package.json` (falta `embla-carousel-autoplay`). Use `npm install`. Não
  regenere o lockfile "para consertar isso" sem que seja o objetivo
  explícito da tarefa — é uma mudança de dependências, não trivial.
- **Não atualize dependências** sem pedido explícito, mesmo que existam
  versões mais novas disponíveis.
- **Nunca exponha segredos.** O `.env` deste repo está versionado, mas
  contém apenas a URL e a chave `anon`/publishable do Supabase (públicas
  por design, protegidas por RLS). Segredos reais (`SUPABASE_SERVICE_ROLE_KEY`,
  `RESEND_API_KEY`, chaves do Asaas) vivem fora deste repo (secrets do
  Supabase e variáveis de ambiente do n8n) — nunca os adicione aqui.
- **Alias `@/*` → `src/*`** (`tsconfig*.json` + `vite.config.ts`). Ao mover
  arquivos, atualize os imports que usam esse alias.
- **`src/assets/cars/` e `src/assets/vehicles/`** têm imagens duplicadas,
  mas ambas as pastas estão em uso por componentes diferentes — não são
  arquivos mortos. Ver `docs/ARCHITECTURE.md` antes de mexer.
- **Não mova** `package.json`, `vite.config.ts`, `index.html`,
  `vercel.json` ou os `tsconfig*.json` para fora da raiz — tanto o Lovable
  quanto um eventual deploy na Vercel esperam a raiz do app na raiz do
  repositório.
- **`webhook-proxy`** (`supabase/functions/webhook-proxy/index.ts`) é o
  único ponto por onde o frontend fala com o n8n — ao adicionar um novo
  fluxo de servidor, registre a URL na whitelist `ALLOWED_URLS` em vez de
  chamar o n8n diretamente do client.
- Leia o service correspondente em `src/lib/*Service.ts` antes de alterar
  uma regra de negócio — as páginas consomem esses services, não o
  Supabase diretamente.

## Erros pré-existentes (não são regressões suas)

- Lint: ~63 erros / ~32 warnings, majoritariamente `no-explicit-any` e
  `react-hooks/exhaustive-deps`.
- Typecheck: erros em `src/components/profile/FaceRecognitionField.tsx` e
  `src/lib/vehicleService.ts` (incompatibilidade de tipos com o schema
  gerado do Supabase).
- Build de produção passa normalmente (só warnings de chunk grande).

Se encontrar esses mesmos erros depois de uma alteração sua, não são
regressão — já existiam antes. Se encontrar erros novos e diferentes
desses, são regressão e devem ser corrigidos ou revertidos.
