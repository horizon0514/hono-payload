import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";
export const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

