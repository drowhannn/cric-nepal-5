import { tournament } from '~/db/schema'
import { createTournamentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return update(
    event,
    {
      table: tournament,
      updateSchema: createTournamentSchema,
    },
  )
})
