import { opponent } from '~/db/schema'
import { createOpponentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return update(
    event,
    {
      table: opponent,
      updateSchema: createOpponentSchema,
    },
  )
})
