import { game, opponent, player, tournament } from '~/db/schema'
import { createGameSchema, createOpponentSchema, createPlayerSchema, createTournamentSchema } from '~/db/zod'
import { crudRouters } from '~/server/utils/rest'

const router = crudRouters([
  {
    table: player,
    searchFields: [
      player.fullName,
    ],
    createAndUpdateSchema: createPlayerSchema,
  },
  {
    table: game,
    searchFields: [
      game.title,
    ],
    createAndUpdateSchema: createGameSchema,
  },
  {
    table: tournament,
    searchFields: [
      tournament.title,
    ],
    createAndUpdateSchema: createTournamentSchema,
  },
  {
    table: opponent,
    searchFields: [
      opponent.name,
    ],
    createAndUpdateSchema: createOpponentSchema,
  },
])

export default useBase('/api/bo', router.handler)
