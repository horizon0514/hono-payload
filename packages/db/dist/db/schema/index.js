// Export all schemas
export * from './users';
// Re-export for convenience
import { users, posts, categories } from './users';
export const schema = {
    users,
    posts,
    categories,
};
