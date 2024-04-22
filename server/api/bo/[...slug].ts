import { game, opponent, player, tournament } from '~/db/schema'
import { createGameSchema, createOpponentSchema, createPlayerSchema, createTournamentSchema } from '~/db/zod'
import { crudRouters } from '~/server/utils/rest'

const router = crudRouters([
  {
    table: player,
    prefix: '/player',
    searchFields: [
      player.fullName,
    ],
    createAndUpdateSchema: createPlayerSchema,
  },
  {
    table: game,
    prefix: '/game',
    searchFields: [
      game.title,
    ],
    createAndUpdateSchema: createGameSchema,
  },
  {
    table: tournament,
    prefix: '/tournament',
    searchFields: [
      tournament.title,
    ],
    createAndUpdateSchema: createTournamentSchema,
  },
  {
    table: opponent,
    prefix: '/opponent',
    searchFields: [
      opponent.name,
    ],
    createAndUpdateSchema: createOpponentSchema,
  },
])

export default useBase('/api/bo', router.handler)
