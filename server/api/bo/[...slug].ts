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
    orderBy: player.id,
    createAndUpdateSchema: createPlayerSchema,
  },
  {
    table: game,
    prefix: '/game',
    searchFields: [
      game.title,
    ],
    orderBy: game.id,
    createAndUpdateSchema: createGameSchema,
  },
  {
    table: tournament,
    prefix: '/tournament',
    searchFields: [
      tournament.title,
    ],
    orderBy: tournament.id,
    createAndUpdateSchema: createTournamentSchema,
  },
  {
    table: opponent,
    prefix: '/opponent',
    searchFields: [
      opponent.name,
    ],
    orderBy: opponent.id,
    createAndUpdateSchema: createOpponentSchema,
  },
])

export default useBase('/api/bo', router.handler)
