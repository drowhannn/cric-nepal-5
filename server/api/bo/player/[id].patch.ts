import { player } from '~/db/schema'
import { createPlayerSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  return update(
    event,
    {
      table: player,
      updateSchema: createPlayerSchema,
    },
  )
})
