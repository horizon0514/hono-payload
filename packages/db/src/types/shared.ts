import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { users, posts, categories } from "../db/schema";

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Post types
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Category types
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
