import { player } from '~/db/schema'
import { createPlayerSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return create(
    event,
    {
      table: player,
      createSchema: createPlayerSchema,
    },
  )
})
