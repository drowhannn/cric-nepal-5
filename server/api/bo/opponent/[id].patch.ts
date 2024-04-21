import { opponent } from '~/db/schema'
import { createOpponentSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return await update(
    event,
    {
      table: opponent,
      updateSchema: createOpponentSchema,
    },
  )
})
