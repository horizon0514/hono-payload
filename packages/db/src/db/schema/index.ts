// Export all schemas
export * from "./users.js";
export * from "./auth.js";

// Re-export for convenience
import { users, posts, categories } from "./users.js";
import { user, session, account, verification } from "./auth.js";

export const schema = {
  users,
  posts,
  categories,
  user,
  session,
  account,
  verification,
};

export type Schema = typeof schema;
