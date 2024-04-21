import { opponent } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return await list(
    event,
    {
      table: opponent,
      searchFields: [
        opponent.name,
      ],
      orderBy: opponent.id,
      noPagination: true,
    },
  )
})
