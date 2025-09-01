### DB Package

Exports Drizzle ORM connection and schemas for Users, Posts, and Categories, plus helper types.

Install and build via workspace:

```bash
pnpm --filter @hono-payload/db build
```

### Exports

From `@hono-payload/db`:

- `db` — Drizzle query client bound to Postgres and schema
- `migrationDb` — Drizzle client for migrations (single-connection)
- `users`, `posts`, `categories` — Drizzle table schemas
- `schema` — Object map of tables `{ users, posts, categories }`
- Types from `@hono-payload/db/types`:
  - `User`, `NewUser`, `Post`, `NewPost`, `Category`, `NewCategory`
  - `ApiResponse<T>`, `PaginatedResponse<T>`

### Environment

Connection string is loaded from `@hono-payload/shared/env` → `env.DATABASE_URI`. See `docs/shared.md` for environment validation.

### Usage

Querying with Drizzle:

```ts
import { db, users } from '@hono-payload/db/db'
import { eq, desc } from 'drizzle-orm'

const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.isActive, true))
  .orderBy(desc(users.createdAt))
```

Inserting:

```ts
import { db, users } from '@hono-payload/db/db'

const [created] = await db
  .insert(users)
  .values({ email: 'new@example.com', name: 'New User' })
  .returning()
```

Migrations (drizzle-kit):

```bash
pnpm --filter @hono-payload/db db:generate
pnpm --filter @hono-payload/db db:migrate
pnpm --filter @hono-payload/db db:studio
```

### Schemas

Users:

```ts
id: uuid, email: varchar(255) unique not null, name?: varchar(255),
avatar?: text, role: varchar(50) default 'user', isActive: boolean default true,
createdAt: timestamp default now, updatedAt: timestamp default now
```

Posts:

```ts
id: uuid, title: varchar(255) not null, slug: varchar(255) unique not null,
content?: text, excerpt?: text, authorId?: uuid → users.id,
published: boolean default false, createdAt/updatedAt: timestamp default now
```

Categories:

```ts
id: uuid, name: varchar(100) not null, slug: varchar(100) unique not null,
description?: text, createdAt/updatedAt: timestamp default now
```

