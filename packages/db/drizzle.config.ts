import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

config()

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI!,
  },
  verbose: true,
  strict: true,
} satisfies Config
