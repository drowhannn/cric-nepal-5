import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return await list(
    event,
    {
      table: tournament,
      searchFields: [
        tournament.title,
      ],
      orderBy: tournament.id,
      noPagination: true,
    },
  )
})
