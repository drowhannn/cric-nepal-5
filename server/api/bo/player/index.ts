import { player } from '~/db/schema'
import { createPlayerSchema } from '~/db/zod'
import { listAndCreateRouter } from '~/server/utils/rest'

const router = listAndCreateRouter({
  table: player,
  list: {
    searchFields: [
      player.fullName,
    ],
    orderBy: player.id,
  },
  create: {
    createSchema: createPlayerSchema,
  },
})

export default useBase('/api/bo/player', router.handler)
