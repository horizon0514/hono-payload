# Hono + PayloadCMS Monorepo

现代化的全栈应用架构，采用 Monorepo 设计，清晰分离关注点。

## 🏗️ 架构概述

- **@hono-payload/shared** - 共享配置和工具（环境变量管理）
- **@hono-payload/db** - 数据库schema、连接和类型定义
- **@hono-payload/api** - Hono API服务器，轻量级高性能
- **@hono-payload/cms** - PayloadCMS后台管理系统

## 📁 项目结构

```
packages/
├── shared/     # 共享配置和工具
├── db/         # 数据库包：schema、连接和类型
├── api/        # Hono API服务器
└── cms/        # PayloadCMS后台管理
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境配置

复制环境变量模板文件并配置数据库：

```bash
cp env.template .env
```

设置你的数据库连接：

```env
DATABASE_URI=postgresql://username:password@localhost:5432/dbname
PAYLOAD_SECRET=your-secret-key
```

**注意：** 
- 使用 `@hono-payload/shared` 包统一管理环境变量
- 支持 Zod 类型验证，确保环境变量类型安全
- 支持多环境配置文件，按优先级自动加载：
  - `.env.{NODE_ENV}.local` (最高优先级)
  - `.env.local` 
  - `.env.{NODE_ENV}` 
  - `.env` (最低优先级)

### 3. 初始化数据库

```bash
# 构建所有包（会自动按依赖顺序构建）
pnpm build

# 生成并推送数据库schema
pnpm db:generate
pnpm db:push
```

### 4. 启动开发环境

**方式1: 全部启动（推荐）**
```bash
pnpm dev
```

**方式2: 单独启动**
```bash
# PayloadCMS后台 (http://localhost:3000)
pnpm dev:cms

# Hono API服务器 (http://localhost:4000)
pnpm dev:api
```

## 📝 可用命令

### 构建
```bash
pnpm build          # 构建所有包（自动按依赖顺序）
pnpm build:shared   # 构建共享包
pnpm build:db       # 构建数据库包
pnpm build:api      # 构建API服务器
pnpm build:cms      # 构建CMS后台
```

### 开发
```bash
pnpm dev           # 启动所有包的开发模式
pnpm dev:db        # 启动db包的类型监听
pnpm dev:api       # 启动API服务器
pnpm dev:cms       # 启动CMS后台
```

### 数据库
```bash
pnpm db:generate   # 生成迁移文件
pnpm db:migrate    # 执行迁移
pnpm db:push       # 推送schema到数据库
pnpm db:studio     # 启动Drizzle Studio
```

### 工具
```bash
pnpm clean         # 清理所有构建产物
pnpm lint          # 代码检查
```

## 🌟 架构特点

- **类型安全**: 端到端TypeScript类型安全
- **清晰分离**: 每个包都有明确的职责范围
- **高性能**: Hono轻量级 + Drizzle零运行时开销
- **易维护**: 模块化设计，高内聚低耦合
- **可扩展**: 可独立部署和扩展各个服务

## 🚀 部署

本项目支持分离式部署：

- **CMS** → Vercel
- **API** → Vercel (支持迁移至 Cloudflare Workers)
- **数据库** → Supabase PostgreSQL

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取详细的部署指南。

## 📖 详细文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构说明和开发指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署配置和操作指南

## 🛠️ 技术栈

- **API**: Hono + Drizzle ORM + PostgreSQL
- **CMS**: PayloadCMS + Next.js
- **类型**: TypeScript + 共享类型定义
- **工具**: pnpm workspace + Monorepo

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！