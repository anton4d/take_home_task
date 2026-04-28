/// <reference types="node" />
import type { Config } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

export default {
  schema: './src/db/schemas',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config