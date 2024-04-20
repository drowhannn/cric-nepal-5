import { opponent } from '~/db/schema'
import { retrieve } from '~/server/utils/rest'

export default defineEventHandler(async (event) => {
  return retrieve(
    event,
    {
      table: opponent,
    },
  )
})
