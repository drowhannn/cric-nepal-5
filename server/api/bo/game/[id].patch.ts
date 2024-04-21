import { game } from '~/db/schema'
import { createGameSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return await update(
    event,
    {
      table: game,
      updateSchema: createGameSchema,
    },
  )
})
