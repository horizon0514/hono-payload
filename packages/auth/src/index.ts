import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@hono-payload/db/db";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  adapter: drizzleAdapter(db as unknown as Record<string, any>, {
    provider: "pg",
  }),
});

