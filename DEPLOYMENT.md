# 部署指南

本项目采用分离式部署架构，各服务独立部署：

- **CMS** → Vercel
- **API** → Vercel (可迁移至 Cloudflare Workers)
- **数据库** → Supabase PostgreSQL

## 🗄️ 数据库部署 (Supabase)

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 获取数据库连接字符串

### 2. 配置数据库

```bash
# 本地构建 db 包
pnpm build:db

# 设置环境变量
export DATABASE_URI="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"

# 推送数据库 schema
pnpm db:push
```

## 🎨 CMS 部署 (Vercel)

### 1. 部署配置

在 Vercel Dashboard 中：

1. **导入项目**: 选择 `packages/cms` 目录
2. **构建配置**:
   ```
   Build Command: pnpm build:db && pnpm build:cms
   Output Directory: .next
   Install Command: pnpm install --filter=@hono-payload/cms --filter=@hono-payload/db
   ```

### 2. 环境变量

在 Vercel 项目设置中添加：

```env
DATABASE_URI=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
PAYLOAD_SECRET=your-super-secret-key-here
```

### 3. 部署命令

```bash
# 从根目录部署
cd packages/cms
vercel --prod
```

## 🚀 API 部署 (Vercel)

### 1. 部署配置

在 Vercel Dashboard 中：

1. **导入项目**: 选择 `packages/api` 目录
2. **构建配置**:
   ```
   Build Command: pnpm build:db && pnpm build:api
   Install Command: pnpm install --filter=@hono-payload/api --filter=@hono-payload/db
   ```

### 2. 环境变量

```env
DATABASE_URI=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### 3. 部署命令

```bash
# 从根目录部署
cd packages/api
vercel --prod
```

## 🌐 域名配置

### CMS 域名示例
```
https://your-cms.vercel.app
```

### API 域名示例
```
https://your-api.vercel.app
```

### CORS 配置

更新 `packages/api/api/index.ts` 中的 CORS 配置：

```typescript
cors({
  origin: [
    'http://localhost:3000',
    'https://your-cms.vercel.app', // 替换为实际的 CMS 域名
  ],
  // ...
})
```

## 🔄 未来迁移到 Cloudflare Workers

当需要迁移 API 到 Cloudflare Workers 时：

### 1. 创建 Cloudflare Workers 入口

```typescript
// packages/api/src/worker.ts
import { Hono } from 'hono'
import { usersRouter } from './routes/users'
// ... 其他路由

const app = new Hono()
// ... 配置路由

export default app
```

### 2. 配置 wrangler.toml

```toml
name = "hono-payload-api"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

### 3. 部署命令

```bash
pnpm wrangler deploy --env production
```

## 📊 监控和日志

### Vercel
- 使用 Vercel Dashboard 查看部署状态和日志
- 配置 Vercel Analytics (可选)

### Supabase
- 使用 Supabase Dashboard 监控数据库性能
- 配置数据库备份

## 🔒 安全配置

### 1. 环境变量安全
- 使用 Vercel 环境变量存储敏感信息
- 不要在代码中硬编码密钥

### 2. 数据库安全
- 启用 Supabase Row Level Security (RLS)
- 配置适当的数据库访问权限

### 3. API 安全
- 配置 CORS 白名单
- 考虑添加 API 速率限制

## 🚨 故障排除

### 常见问题

1. **构建失败**: 检查 pnpm workspace 配置
2. **数据库连接失败**: 验证 DATABASE_URI 格式
3. **CORS 错误**: 检查域名配置

### 调试命令

```bash
# 本地测试构建
pnpm build:db && pnpm build:api
pnpm build:db && pnpm build:cms

# 本地测试运行
pnpm dev:api
pnpm dev:cms
```

## 📈 性能优化

### Vercel 优化
- 启用 Edge Runtime (适用时)
- 配置 CDN 缓存
- 使用 Vercel Analytics

### 数据库优化
- 配置 Supabase 连接池
- 启用数据库缓存
- 监控查询性能

这个部署方案具有很好的可扩展性，可以根据需求逐步迁移和优化各个服务。
