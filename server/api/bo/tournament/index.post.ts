import { tournament } from '~/db/schema'
import { createTournamentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return create(
    event,
    {
      table: tournament,
      createSchema: createTournamentSchema,
    },
  )
})
