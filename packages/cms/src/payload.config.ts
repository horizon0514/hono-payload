// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { AdminUsers } from './collections/Users'
import { Media } from './collections/Media'
import { AppUsers } from './collections/AppUsers'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { schema } from '@hono-payload/db/db'
import { env } from '@hono-payload/shared/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: AdminUsers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    AdminUsers, // CMS管理员用户
    AppUsers, // 应用前端用户
    Posts, // 文章
    Categories, // 分类
    Media, // 媒体文件
  ],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    // 混合现有的Drizzle schema
    beforeSchemaInit: [
      ({ schema: payloadSchema }) => ({
        ...payloadSchema,
        tables: {
          ...payloadSchema.tables,
          ...(schema as any),
        },
      }),
    ],
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
