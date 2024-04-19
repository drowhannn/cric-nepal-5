import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { player } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const response = await db.select().from(player).where(eq(player.id, id))
  if (!response.length)
    throw new Error('Resource not found.')

  return response[0]
})
