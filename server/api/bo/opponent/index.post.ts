import { opponent } from '~/db/schema'

import { createOpponentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readValidatedBody(event, createOpponentSchema.parse)
  await db.insert(opponent).values(body)
  return {
    success: true,
  }
})
