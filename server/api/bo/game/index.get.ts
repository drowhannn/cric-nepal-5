import { game } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return await list(
    event,
    {
      table: game,
      searchFields: [
        game.title,
      ],
      orderBy: game.id,
    },
  )
})
