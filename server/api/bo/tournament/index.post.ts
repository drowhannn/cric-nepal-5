import { tournament } from '~/db/schema'

import { createTournamentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readValidatedBody(event, createTournamentSchema.parse)
  await db.insert(tournament).values(body)
  return {
    success: true,
  }
})
