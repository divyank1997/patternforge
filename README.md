# PatternForge

> AI-powered 3D generative pattern platform — describe a pattern in text, we render it in 3D.

## Architecture

### Micro Frontends (`apps/`)

| App | Port | Description |
|---|---|---|
| `shell` | 3000 | Host container — composes all MFEs |
| `mfe-auth` | 3001 | Login, signup, profile |
| `mfe-editor` | 3002 | 3D pattern editor (React Three Fiber) |
| `mfe-gallery` | 3003 | Public pattern discovery & browsing |
| `mfe-dashboard` | 3004 | User dashboard & analytics |

### Microservices (`services/`)

| Service | Port | DB | Description |
|---|---|---|---|
| `api-gateway` | 4000 | — | Single entry point, routing, rate limiting |
| `auth-service` | 4001 | PostgreSQL | JWT auth, user management |
| `pattern-service` | 4002 | DynamoDB | Pattern CRUD, versioning, high-throughput |
| `search-service` | 4003 | OpenSearch | Full-text + vector search |
| `ai-service` | 4004 | — | Claude API — text-to-pattern generation |
| `notification-service` | 4005 | SQS/SES | Async email & event notifications |

### Shared Packages (`packages/`)

| Package | Description |
|---|---|
| `shared-types` | TypeScript types shared across FE + BE |
| `shared-ui` | React component library (Button, Input, Card...) |
| `shared-utils` | Utility functions (cn, formatDate...) |
| `shared-config` | ESLint, Prettier, TypeScript base configs |

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, React Three Fiber (Three.js), Framer Motion
- **Backend**: Fastify, TypeScript, Prisma, Zod
- **Databases**: PostgreSQL (users), DynamoDB (patterns), OpenSearch (search)
- **AI**: Anthropic Claude API
- **Infra**: AWS (ECS, RDS, DynamoDB, OpenSearch, SQS, SES), AWS CDK
- **Monorepo**: Turborepo
- **CI/CD**: GitHub Actions

## Getting Started

```bash
# Install dependencies
npm install

# Run all services in dev mode
npm run dev

# Build all
npm run build

# Type check
npm run type-check
```

## Database Architecture Decision

| Database | Why |
|---|---|
| PostgreSQL | Relational data — users, auth, billing. Strong consistency required. |
| DynamoDB | Pattern metadata at scale — high write throughput, single-digit ms reads. |
| OpenSearch | Full-text search + vector similarity across patterns. |

Each database is **owned by exactly one service** — no cross-service database access.
