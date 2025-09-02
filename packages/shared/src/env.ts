import { z } from "zod";
import { config } from "dotenv-flow";
import path from "path";
import { existsSync } from "fs";

// 查找项目根目录
function findProjectRoot(): string {
  let currentPath = process.cwd();

  // 从当前目录向上查找，直到找到包含工作区标识文件的目录
  while (currentPath !== path.dirname(currentPath)) {
    const indicators = ["turbo.json", "bun.lockb", "pnpm-workspace.yaml"];
    if (indicators.some((f) => existsSync(path.join(currentPath, f)))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }

  return process.cwd();
}

// 加载环境变量 - dotenv-flow 会自动按优先级加载多个文件
const projectRoot = findProjectRoot();
config({
  path: projectRoot,
  silent: false, // 显示加载信息
});

// 定义环境变量 schema
const envSchema = z.object({
  DATABASE_URI: z.string().url("DATABASE_URI must be a valid URL"),
  PAYLOAD_SECRET: z.string().min(32, "PAYLOAD_SECRET must be at least 32 characters"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HONO_PORT: z.coerce.number().int().positive().default(4000),
});

// 验证环境变量
const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error("❌ 环境变量验证失败:");
  console.error(envResult.error.flatten().fieldErrors);
  console.error("\n请检查项目根目录的环境变量文件配置");
  console.error(
    "支持的文件（按优先级）: .env.{NODE_ENV}.local > .env.local > .env.{NODE_ENV} > .env",
  );
  console.error("参考 env.template 文件获取配置模板");
  process.exit(1);
}

// 导出验证后的环境变量
export const env = envResult.data;

// 便捷函数
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

// 记录加载状态（仅开发环境）
if (isDev) {
  console.log("✅ 环境变量加载成功:", {
    NODE_ENV: env.NODE_ENV,
    HONO_PORT: env.HONO_PORT,
    DATABASE_URI: env.DATABASE_URI.replace(/:[^:@]*@/, ":****@"),
    PAYLOAD_SECRET: "****",
  });
}
