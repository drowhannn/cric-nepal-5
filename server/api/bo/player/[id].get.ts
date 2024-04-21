import { player } from '~/db/schema'
import { retrieve } from '~/server/utils/rest'

export default defineEventHandler(async (event) => {
  return await retrieve(
    event,
    {
      table: player,
    },
  )
})
