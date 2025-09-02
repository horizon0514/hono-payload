import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";
import path from "path";
import { existsSync } from "fs";
import { config as dotenvFlowConfig } from "dotenv-flow";

function findProjectRoot(): string {
  let currentPath = process.cwd();
  while (currentPath !== path.dirname(currentPath)) {
    const indicators = ["turbo.json", "bun.lockb"];
    if (indicators.some((f) => existsSync(path.join(currentPath, f)))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  return process.cwd();
}

dotenvFlowConfig({ path: findProjectRoot(), silent: true });

export const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    HONO_PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

