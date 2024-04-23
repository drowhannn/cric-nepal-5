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
    includeNoPaginationListRoute: true,
  },
  {
    table: game,
    searchFields: [
      game.title,
    ],
    createAndUpdateSchema: createGameSchema,
    includeNoPaginationListRoute: true,
  },
  {
    table: tournament,
    searchFields: [
      tournament.title,
    ],
    createAndUpdateSchema: createTournamentSchema,
    includeNoPaginationListRoute: true,
  },
  {
    table: opponent,
    searchFields: [
      opponent.name,
    ],
    createAndUpdateSchema: createOpponentSchema,
    includeNoPaginationListRoute: true,
  },
])

export default useBase('/api/bo', router.handler)
