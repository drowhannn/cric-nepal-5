import { player } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return await list(
    event,
    {
      table: player,
      searchFields: [
        player.fullName,
      ],
      orderBy: player.id,
    },
  )
})
