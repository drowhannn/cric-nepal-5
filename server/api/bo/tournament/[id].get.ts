import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return await retrieve(
    event,
    {
      table: tournament,
    },
  )
})
