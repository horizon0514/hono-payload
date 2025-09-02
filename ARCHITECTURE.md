# Hono + PayloadCMS Monorepo 架构说明

## 架构概述

本项目采用现代化的 **Monorepo** 架构，清晰分离关注点：

- **@hono-payload/db** - 数据库schema、连接和类型定义
- **@hono-payload/api** - Hono API服务器，轻量级高性能
- **@hono-payload/cms** - PayloadCMS后台管理系统
- **PostgreSQL** - 统一的数据库存储

## 核心设计理念

1. **Monorepo架构**: 清晰的包分离，独立开发和部署
2. **Schema统一管理**: 所有数据库schema由db包的Drizzle定义
3. **类型安全**: 端到端TypeScript类型安全，包间类型共享
4. **独立服务**: API和CMS作为独立服务，可分别扩展
5. **工作区依赖**: 使用 Bun workspaces + Turborepo 实现高效的包管理

## Monorepo 目录结构

```
hono-payload/
├── packages/
│   ├── db/                     # 数据库包 @hono-payload/db
│   │   ├── src/
│   │   │   ├── db/            # 数据库Schema和连接
│   │   │   │   ├── connection.ts
│   │   │   │   ├── schema/     # Drizzle Schema定义
│   │   │   │   └── migrations/ # 数据库迁移文件
│   │   │   ├── types/         # 共享TypeScript类型
│   │   │   └── index.ts       # 包入口
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── drizzle.config.ts  # Drizzle配置
│   ├── api/                   # API服务器 @hono-payload/api
│   │   ├── src/
│   │   │   ├── routes/        # API路由
│   │   │   │   ├── users.ts
│   │   │   │   ├── posts.ts
│   │   │   │   └── categories.ts
│   │   │   └── server.ts      # Hono服务器入口
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── cms/                   # CMS后台 @hono-payload/cms
│       ├── src/
│       │   ├── app/           # Next.js应用
│       │   ├── collections/   # PayloadCMS集合
│       │   ├── payload.config.ts
│       │   └── payload-types.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.mjs
├── package.json               # 根package.json（Bun workspaces）
├── package.json               # 根package.json
└── ARCHITECTURE.md
```

## 数据库表设计

### Users 表
- 用户基本信息（email, name, avatar, role）
- 账户状态管理
- 时间戳字段

### Posts 表
- 文章内容管理（title, slug, content, excerpt）
- 作者关联
- 发布状态控制

### Categories 表
- 分类管理（name, slug, description）
- 用于内容分类

## API接口设计

所有API都遵循RESTful规范，返回统一的JSON格式：

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### 用户API (`/api/users`)
- `GET /` - 获取用户列表（支持分页）
- `GET /:id` - 获取单个用户
- `POST /` - 创建用户
- `PUT /:id` - 更新用户
- `DELETE /:id` - 删除用户

### 文章API (`/api/posts`)
- `GET /` - 获取文章列表（支持分页和发布状态过滤）
- `GET /:id` - 获取单篇文章
- `GET /slug/:slug` - 通过slug获取文章
- `POST /` - 创建文章
- `PUT /:id` - 更新文章
- `DELETE /:id` - 删除文章

### 分类API (`/api/categories`)
- `GET /` - 获取分类列表
- `GET /:id` - 获取单个分类
- `GET /slug/:slug` - 通过slug获取分类
- `POST /` - 创建分类
- `PUT /:id` - 更新分类
- `DELETE /:id` - 删除分类

## 开发和部署

### Monorepo 开发环境

#### 初始化项目
```bash
# 安装所有依赖
bun install

# 构建数据库包（必须先构建）
pnpm build:db
```

#### 开发环境启动

**方式1: 全部启动（并行）**
```bash
bun run dev  # 启动所有包的开发模式
```

**方式2: 单独启动**
```bash
# 启动PayloadCMS后台 (http://localhost:3000)
bun run dev:cms

# 启动Hono API服务器 (http://localhost:4000)  
bun run dev:api

# 启动db包的类型监听
pnpm dev:db
```

#### 构建命令
```bash
# 构建所有包
bun run build

# 单独构建
bun run build:db       # 必须先构建
bun run build:api
bun run build:cms
```

### 数据库管理

所有数据库操作都通过db包管理：

```bash
# 生成migration文件
bun run db:generate

# 执行migrations
bun run db:migrate

# 推送schema到数据库（开发环境）
bun run db:push

# 启动Drizzle Studio
bun run db:studio
```

### 环境变量

```env
DATABASE_URI=postgresql://username:password@localhost:5432/dbname
PAYLOAD_SECRET=your-secret-key
HONO_PORT=4000
```

## 关键集成点

### PayloadCMS与Drizzle集成

在`payload.config.ts`中通过`beforeSchemaInit`将db包管理的schema注入到PayloadCMS：

```typescript
beforeSchemaInit: [
  ({ schema: payloadSchema }) => ({
    ...payloadSchema,
    tables: {
      ...payloadSchema.tables,
      // Add Drizzle-managed tables to PayloadCMS schema
      ...schema,
    },
  }),
],
```

这样PayloadCMS就可以在Admin界面中访问和管理Drizzle定义的表。

### 类型安全

所有数据库操作都通过Drizzle的类型安全接口，确保编译时类型检查：

```typescript
// 从schema推断类型
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
```

## Monorepo 架构优势

### 开发体验
1. **清晰的关注点分离**: 每个包都有明确的职责范围
2. **类型安全**: 端到端TypeScript类型安全，包间类型共享
3. **开发效率**: 统一的工具链和构建流程
4. **IDE支持**: 优秀的跳转、自动完成和重构支持

### 维护性
1. **独立版本控制**: 每个包可以独立版本管理
2. **依赖管理**: 清晰的包依赖关系，避免循环依赖
3. **代码复用**: db包避免代码重复
4. **模块化**: 高内聚、低耦合的模块设计

### 可扩展性
1. **水平扩展**: 易于添加新的包和服务
2. **独立部署**: API和CMS可以独立部署和扩展
3. **技术栈灵活**: 每个包可以选择合适的技术栈
4. **团队协作**: 不同团队可以专注于不同的包

### 性能优势
1. **构建优化**: 增量构建，只构建变更的包
2. **运行时性能**: Hono轻量级，Drizzle零运行时开销
3. **缓存效率**: Bun + Turborepo 提供高效的依赖缓存
4. **按需加载**: 可以按需构建和部署特定服务

## 后续扩展

- 添加认证中间件
- 实现权限控制
- 添加缓存层（Redis）
- 集成文件上传服务
- 添加搜索功能
- 实现实时功能（WebSocket）
