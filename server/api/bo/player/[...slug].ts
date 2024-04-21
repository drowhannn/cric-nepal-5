import { player } from '~/db/schema'
import { createPlayerSchema } from '~/db/zod'
import { retrieveUpdateRemoveRouter } from '~/server/utils/rest'

const router = retrieveUpdateRemoveRouter({
  table: player,
  update: {
    updateSchema: createPlayerSchema,
  },
})

export default useBase('/api/bo/player', router.handler)
