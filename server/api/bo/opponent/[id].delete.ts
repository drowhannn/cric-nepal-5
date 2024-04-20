import { opponent } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return remove(
    event,
    {
      table: opponent,
    },
  )
})
