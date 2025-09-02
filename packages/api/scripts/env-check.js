#!/usr/bin/env node
import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    HONO_PORT: z.coerce.number().int().positive().default(4000),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})._unsafeUnwrap();

const maskedDb = env.DATABASE_URI.replace(/:[^:@]*@/, ":****@");
console.log(JSON.stringify({
  NODE_ENV: env.NODE_ENV,
  HONO_PORT: env.HONO_PORT,
  DATABASE_URI: maskedDb,
}, null, 2));

