# Hono + PayloadCMS Monorepo

现代化的全栈应用架构，采用 Monorepo 设计，清晰分离关注点。

## 🏗️ 架构概述

- **@hono-payload/db** - 数据库schema、连接和类型定义
- **@hono-payload/api** - Hono API服务器，轻量级高性能
- **@hono-payload/cms** - PayloadCMS后台管理系统

## 📁 项目结构

```
packages/
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

复制环境变量文件并配置数据库：

```bash
cp .env.example .env
```

设置你的数据库连接：

```env
DATABASE_URI=postgresql://username:password@localhost:5432/dbname
PAYLOAD_SECRET=your-secret-key
```

### 3. 初始化数据库

```bash
# 构建数据库包（必须先做）
pnpm build:db

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
pnpm build          # 构建所有包
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

## 📖 详细文档

查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 获取详细的架构说明和开发指南。

## 🛠️ 技术栈

- **API**: Hono + Drizzle ORM + PostgreSQL
- **CMS**: PayloadCMS + Next.js
- **类型**: TypeScript + 共享类型定义
- **工具**: pnpm workspace + Monorepo

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！