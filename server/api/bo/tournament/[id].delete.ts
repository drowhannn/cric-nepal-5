import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return await remove(
    event,
    {
      table: tournament,
    },
  )
})
