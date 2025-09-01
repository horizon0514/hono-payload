### API Reference

This package exposes a Hono-based REST API server. Base URL defaults to `http://localhost:${HONO_PORT}` (see `@hono-payload/shared/env`). All responses use a consistent envelope.

```ts
type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Server

- Start dev: `pnpm --filter @hono-payload/api dev`
- Routes are mounted in `packages/api/src/server.ts`:
  - `GET /` health check
  - `/api/users` → Users routes
  - `/api/posts` → Posts routes
  - `/api/categories` → Categories routes

---

### Users

Base: `/api/users`

- GET `/` — List users with pagination
  - Query: `page?` (number, default 1), `limit?` (number, default 10)
  - 200 → `PaginatedResponse<User>`

- GET `/:id` — Fetch user by id
  - 200 → `ApiResponse<User>`; 404 if not found

- POST `/` — Create user
  - Body: `{ email: string; name?: string; avatar?: string; role?: 'user'|'admin'|'editor'; isActive?: boolean }`
  - 201 → `ApiResponse<User>`

- PUT `/:id` — Update user
  - Body: Partial of creation fields
  - 200 → `ApiResponse<User>`; 404 if not found

- DELETE `/:id` — Delete user
  - 200 → `ApiResponse`

Example (curl):

```bash
curl -X POST http://localhost:4000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","name":"Jane"}'
```

---

### Posts

Base: `/api/posts`

- GET `/` — List posts with pagination and filters
  - Query: `page?`, `limit?`, `published?` (boolean)
  - 200 → `PaginatedResponse<PostWithAuthor>`

- GET `/:id` — Fetch post by id (joins author)
  - 200 → `ApiResponse<PostWithAuthor>`; 404 if not found

- GET `/slug/:slug` — Fetch post by slug
  - 200 → `ApiResponse<PostWithAuthor>`; 404 if not found

- POST `/` — Create post
  - Body: `{ title: string; slug: string; content?: string; excerpt?: string; authorId?: string; published?: boolean }`
  - 201 → `ApiResponse<Post>`

- PUT `/:id` — Update post
  - Body: Partial of creation fields
  - 200 → `ApiResponse<Post>`; 404 if not found

- DELETE `/:id` — Delete post
  - 200 → `ApiResponse`

Example (curl):

```bash
curl 'http://localhost:4000/api/posts?page=1&limit=10&published=true'
```

---

### Categories

Base: `/api/categories`

- GET `/` — List categories with pagination
  - Query: `page?`, `limit?`
  - 200 → `PaginatedResponse<Category>`

- GET `/:id` — Fetch category by id
  - 200 → `ApiResponse<Category>`; 404 if not found

- GET `/slug/:slug` — Fetch category by slug
  - 200 → `ApiResponse<Category>`; 404 if not found

- POST `/` — Create category
  - Body: `{ name: string; slug: string; description?: string }`
  - 201 → `ApiResponse<Category>`

- PUT `/:id` — Update category
  - Body: Partial of creation fields
  - 200 → `ApiResponse<Category>`; 404 if not found

- DELETE `/:id` — Delete category
  - 200 → `ApiResponse`

Example (curl):

```bash
curl -X POST http://localhost:4000/api/categories \
  -H 'Content-Type: application/json' \
  -d '{"name":"Tech","slug":"tech"}'
```

---

### Error handling

- 404: `{ error: 'Not Found' }`
- 500: `{ error: 'Internal Server Error' }`

### CORS

Allowed origins: `http://localhost:3000`, `http://localhost:3001`. Methods: GET, POST, PUT, DELETE, PATCH. Credentials enabled.

