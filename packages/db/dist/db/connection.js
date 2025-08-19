import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URI;
// For query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });
// For migrations
const migrationClient = postgres(connectionString, { max: 1 });
export const migrationDb = drizzle(migrationClient, { schema });
