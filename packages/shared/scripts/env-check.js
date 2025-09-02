#!/usr/bin/env node
import { env } from "@hono-payload/shared/env";

// 输出关键变量的掩码版本，便于 CI/日志查看
const maskedDb = env.DATABASE_URI.replace(/:[^:@]*@/, ":****@");
console.log(
  JSON.stringify(
    {
      NODE_ENV: env.NODE_ENV,
      HONO_PORT: env.HONO_PORT,
      DATABASE_URI: maskedDb,
      PAYLOAD_SECRET: "****",
    },
    null,
    2,
  ),
);
