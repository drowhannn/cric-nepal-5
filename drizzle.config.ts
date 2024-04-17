import process from 'node:process'

import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default <Config>{
  driver: 'pg',
  dbCredentials: {
    connectionString: `${process.env.DATABASE_URL}?sslmode=require`,
  },
  out: './db/migrations',
  schema: './db/schema/index.ts',
}
