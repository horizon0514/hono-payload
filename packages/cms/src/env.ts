import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    PAYLOAD_SECRET: z.string().min(32),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});

