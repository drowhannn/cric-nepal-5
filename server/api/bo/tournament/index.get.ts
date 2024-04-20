import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return list(
    event,
    {
      table: tournament,
      searchFields: [
        tournament.title,
      ],
      orderBy: tournament.id,
    },
  )
})
