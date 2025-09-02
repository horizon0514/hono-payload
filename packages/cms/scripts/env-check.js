#!/usr/bin/env node
import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    PAYLOAD_SECRET: z.string().min(32),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})._unsafeUnwrap();

const maskedDb = env.DATABASE_URI.replace(/:[^:@]*@/, ":****@");
console.log(JSON.stringify({
  NODE_ENV: env.NODE_ENV,
  DATABASE_URI: maskedDb,
  PAYLOAD_SECRET: "****",
}, null, 2));

