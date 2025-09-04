### Shared Utilities

This package centralizes environment configuration and common exports.

Build:

```bash
pnpm --filter @hono-payload/shared build
```

### Exports

- `env` — validated environment variables via Zod
- `isDev`, `isProd`, `isTest` — boolean helpers

Import paths:

```ts
import { env, isDev } from '@hono-payload/shared/env'
```

### Environment Loading

- Uses `dotenv-flow` to load `.env`, `.env.local`, `.env.{NODE_ENV}`, `.env.{NODE_ENV}.local` from the project root (auto-discovered via `pnpm-workspace.yaml`).
- Required variables (Zod schema):
  - `DATABASE_URI`: valid URL
  - `PAYLOAD_SECRET`: at least 32 characters
  - `NODE_ENV`: `development | production | test` (default `development`)
  - `HONO_PORT`: positive integer (default `4000`)

On validation failure, the process logs friendly errors and exits. In dev, successful loads print a sanitized summary with secrets masked.

### Usage Example

```ts
import { env, isDev } from '@hono-payload/shared/env'

const port = env.HONO_PORT
if (isDev) console.log(`Starting server on ${port}...`)
```

