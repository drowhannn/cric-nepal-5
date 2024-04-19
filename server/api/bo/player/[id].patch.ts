import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { player } from '~/db/schema'

import { createPlayerSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const body = await readValidatedBody(event, createPlayerSchema.parse)
  await db.update(player).set(body).where(eq(player.id, id))
  return {
    success: true,
  }
})
