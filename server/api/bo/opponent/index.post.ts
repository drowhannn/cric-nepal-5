import { opponent } from '~/db/schema'
import { createOpponentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return create(
    event,
    {
      table: opponent,
      createSchema: createOpponentSchema,
    },
  )
})
