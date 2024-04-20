import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const response = await db.select().from(tournament).where(eq(tournament.id, id))
  if (!response.length)
    throw new Error('Resource not found.')

  return response[0]
})
