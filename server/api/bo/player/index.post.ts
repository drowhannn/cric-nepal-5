import { player } from '~/db/schema'

import { createPlayerSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readValidatedBody(event, createPlayerSchema.parse)
  await db.insert(player).values(body)
  return {
    success: true,
  }
})
