import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { player } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const response = await db.delete(player).where(eq(player.id, id))
  return response
})
