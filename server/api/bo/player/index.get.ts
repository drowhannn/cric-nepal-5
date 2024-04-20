import { player } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return list(
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
