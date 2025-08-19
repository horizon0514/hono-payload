import postgres from 'postgres';
import * as schema from './schema/index.js';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
export declare const migrationDb: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
//# sourceMappingURL=connection.d.ts.map