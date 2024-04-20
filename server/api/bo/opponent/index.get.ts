import { opponent } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return list(
    event,
    {
      table: opponent,
      searchFields: [
        opponent.name,
      ],
      orderBy: opponent.id,
    },
  )
})
