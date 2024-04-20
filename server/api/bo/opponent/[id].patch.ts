import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { opponent } from '~/db/schema'

import { createOpponentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const body = await readValidatedBody(event, createOpponentSchema.parse)
  await db.update(opponent).set(body).where(eq(opponent.id, id))
  return {
    success: true,
  }
})
