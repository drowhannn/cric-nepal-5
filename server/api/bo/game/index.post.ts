import { game } from '~/db/schema'
import { createGameSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return create(
    event,
    {
      table: game,
      createSchema: createGameSchema,
    },
  )
})
