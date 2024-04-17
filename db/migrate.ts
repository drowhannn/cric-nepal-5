import process from 'node:process'

import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { drizzle } from 'drizzle-orm/postgres-js'

const url = `${process.env.DATABASE_URL}`
const db = drizzle(postgres(url, { ssl: 'require', max: 1 }))

migrate(db, {
  migrationsFolder: './db/drizzle_migrations',
}).then(() =>

  console.log('🎉 Migration complete'),
).catch((error) => {
  console.error('⚠️ Migration failed')
  console.error(error)
}).finally(() => {
  process.exit()
})
