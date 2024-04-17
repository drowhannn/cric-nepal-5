import ws from 'ws'

import { Pool as NeonClient, neonConfig } from '@neondatabase/serverless'

import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless'

import * as schema from '~/db/schema'

neonConfig.webSocketConstructor = ws

const dbUrl = useRuntimeConfig().databaseUrl

if (!dbUrl)
  throw new Error('Missing databaseUrl')

export const useClient = () => {
  return new NeonClient({ connectionString: dbUrl })
}

export const useDB = () => {
  return drizzleNeon(useClient(), { schema })
}
