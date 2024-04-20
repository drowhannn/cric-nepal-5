import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { tournament } from '~/db/schema'

import { createTournamentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const body = await readValidatedBody(event, createTournamentSchema.parse)
  await db.update(tournament).set(body).where(eq(tournament.id, id))
  return {
    success: true,
  }
})
