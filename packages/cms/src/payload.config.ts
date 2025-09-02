// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { zh } from "@payloadcms/translations/languages/zh";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { schema } from "@hono-payload/db/db";
import { env } from "./env";
import { AppUsers } from "./collections/AppUsers";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { AdminUsers } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    push: false,
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
  i18n: {
    supportedLanguages: { zh },
    fallbackLanguage: "zh",
  },
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
