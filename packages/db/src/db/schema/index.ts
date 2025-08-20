// Export all schemas
export * from './users.js'

// Re-export for convenience
import { categories, posts, users } from './users.js'

export const schema = {
  users,
  posts,
  categories,
}

export type Schema = typeof schema
