import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return retrieve(
    event,
    {
      table: tournament,
    },
  )
})
