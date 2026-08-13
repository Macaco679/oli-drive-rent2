# OLI — Aluguel de Carros Entre Particulares

Plataforma web mobile-first de aluguel de carros peer-to-peer: motoristas de
aplicativo (Uber, 99, InDrive) e usuários em geral alugam carros diretamente
de proprietários individuais, com cadastro de veículos, reservas, vistoria
fotográfica, contrato digital, chat e pagamento (caução via Asaas).

**Produção:** https://oli-drive-rent.lovable.app
**Editor Lovable:** https://lovable.dev/projects/62484da3-78f7-45d7-aa38-c85ebf573d00

## Stack

- **Frontend:** Vite + React 18 + TypeScript
- **UI:** shadcn-ui (Radix primitives) + Tailwind CSS
- **Roteamento:** React Router
- **Dados/estado servidor:** TanStack Query
- **Formulários:** react-hook-form + zod
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)
- **Automação externa:** n8n (fluxo de caução via Asaas)

## Estrutura do projeto

```
├── src/
│   ├── pages/            # Uma página por rota (ver src/App.tsx)
│   ├── components/       # ui/ (shadcn) + pastas por domínio
│   │                     # (vehicles, reservations, payments, inspection,
│   │                     # contracts, chat, profile, landing, layout)
│   ├── hooks/            # Hooks de dados/realtime (contrato, caução,
│   │                     # vistoria, pagamento, fotos de veículo)
│   ├── contexts/         # DriverLicenseContext, ChatWidgetContext
│   ├── lib/               # Camada de serviços (um arquivo por domínio:
│   │                     # vehicleService, contractService, chatService, etc.)
│   ├── integrations/supabase/  # Cliente Supabase + tipos gerados do schema
│   └── assets/            # Imagens — ver docs/ARCHITECTURE.md sobre as
│                         # pastas cars/ e vehicles/ (duplicação conhecida)
├── supabase/
│   ├── migrations/        # Migrations do schema (gerenciadas via Lovable/Supabase)
│   └── functions/         # Edge Functions: send-notification-email, webhook-proxy
├── n8n/workflows/          # Workflows de caução via Asaas (create/callback/release)
├── public/                 # Assets estáticos servidos diretamente
└── docs/ARCHITECTURE.md    # Visão geral da arquitetura e dos fluxos principais
```

## Pré-requisitos

- Node.js 18+ e npm

## Instalação

```sh
git clone <URL_DO_REPO>
cd oli-drive-rent2
npm install
```

## Configuração

Copie `.env.example` para `.env` e preencha com as credenciais do seu
projeto Supabase (Project Settings → API no painel do Supabase). Nunca
commite valores reais de `.env`.

## Desenvolvimento

```sh
npm run dev
```

Sobe o servidor Vite em `http://localhost:8080`.

## Scripts

| Comando            | Descrição                                  |
|---------------------|---------------------------------------------|
| `npm run dev`       | Servidor de desenvolvimento (porta 8080)     |
| `npm run build`     | Build de produção                            |
| `npm run build:dev` | Build em modo development (útil para debug)  |
| `npm run lint`      | ESLint                                       |
| `npm run preview`   | Preview local do build de produção           |

## Arquitetura

Veja [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) para o fluxo completo
(frontend ↔ Supabase ↔ n8n/Asaas), autenticação, modelo de dados e
integrações.

## Deploy

O projeto é publicado através do Lovable (Share → Publish), que sincroniza
automaticamente com este repositório GitHub — qualquer edição feita no
editor Lovable gera um commit aqui (autor `lovable-dev`), e pushes manuais
para este repositório também são refletidos de volta no projeto Lovable.

Existe também um `vercel.json` na raiz configurando rewrite de SPA
(`/* → /index.html`), indicativo de um possível deploy/preview alternativo
via Vercel. Não altere a localização da raiz do projeto nem os arquivos de
configuração (`vercel.json`, `vite.config.ts`, `tsconfig*.json`) sem
entender o impacto no build da plataforma de deploy em uso.

## Convenções importantes

- Alias `@/*` aponta para `src/*` (configurado em `tsconfig*.json` e
  `vite.config.ts`) — usado em praticamente todos os imports internos.
- Variáveis de ambiente do frontend usam o prefixo `VITE_` (exigido pelo Vite
  para serem expostas ao client-side).
- As pastas `src/assets/cars/` e `src/assets/vehicles/` contêm imagens
  parcialmente duplicadas, mas **ambas estão em uso** por componentes
  diferentes (`CarsCarousel` e `VehicleCard`/`VehicleDetails`,
  respectivamente) — não são arquivos mortos. Ver `docs/ARCHITECTURE.md`.

## Troubleshooting

- `npm ci` falha com erro de lockfile fora de sincronia
  (`embla-carousel-autoplay` ausente do `package-lock.json`). Use
  `npm install` normalmente; isso é uma pendência conhecida, não introduzida
  por esta reorganização. Ver detalhes em `docs/ARCHITECTURE.md`.
