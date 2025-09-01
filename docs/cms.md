### CMS (Next.js + Payload)

This package hosts a Next.js app with Payload CMS. It exposes admin UI, REST and GraphQL endpoints, and a minimal frontend.

Run dev:

```bash
pnpm --filter @hono-payload/cms dev
```

### Admin

- Admin UI route: defined by `payload.config.ts` (`routes.admin` resolved by Payload). The landing page links to it from `app/(frontend)/page.tsx`.
- Layout: `app/(payload)/layout.tsx` provided by Payload.

### API Endpoints (handled by Payload)

- REST: `app/(payload)/api/[...slug]/route.ts`
  - Exposes CRUD for collections via Payload REST routes
  - Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS

- GraphQL: `app/(payload)/api/graphql/route.ts`
  - POST endpoint for GraphQL
  - GraphQL Playground under `app/(payload)/api/graphql-playground/` (if enabled)

### Frontend

- `app/(frontend)/layout.tsx` — basic HTML layout
- `app/(frontend)/page.tsx` — demo home page showing login state and link to the admin

Usage example (server component):

```tsx
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })
const posts = await payload.find({ collection: 'posts', limit: 10 })
```

### Collections

Configured in `src/payload.config.ts` with Postgres adapter and merged Drizzle schema.

- `users` (AppUsers) — app-facing users
  - fields: id (uuid text default), email (unique, required), name, avatar, role (select: user|admin|editor), isActive (checkbox)

- `posts` — blog posts
  - fields: id, title (required), slug (unique, required), content (textarea), excerpt (textarea), author (relationship → users), published (checkbox), createdAt/updatedAt (date, read-only)

- `categories` — content categories
  - fields: id, name (required), slug (unique, required), description (textarea), createdAt/updatedAt

- `media` — file uploads (see `collections/Media.ts`)

- `admin-users` — Payload admin auth collection (see `collections/Users.ts`)

### Database Integration

Uses `@payloadcms/db-postgres` with `env.DATABASE_URI`. Drizzle table definitions from `@hono-payload/db/db` are merged into Payload via `beforeSchemaInit` to allow shared tables.

### Authentication

`app/(frontend)/page.tsx` demonstrates reading the current `user` via `payload.auth({ headers })` to show a personalized greeting if logged in.

