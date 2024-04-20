import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { opponent } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const response = await db.delete(opponent).where(eq(opponent.id, id))
  return response
})
