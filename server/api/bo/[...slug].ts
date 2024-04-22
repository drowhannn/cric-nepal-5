import { game, opponent, player, tournament } from '~/db/schema'
import { createGameSchema, createOpponentSchema, createPlayerSchema, createTournamentSchema } from '~/db/zod'
import { crudRouter } from '~/server/utils/rest'

let router = crudRouter({
  table: player,
  prefix: '/player',
  list: {
    searchFields: [
      player.fullName,
    ],
    orderBy: player.id,
  },
  create: {
    createSchema: createPlayerSchema,
  },
  update: {
    updateSchema: createPlayerSchema,
  },
  includeNoPaginationListRoute: true,
})

router = crudRouter({
  table: game,
  prefix: '/game',
  router,
  list: {
    searchFields: [
      game.title,
    ],
    orderBy: game.id,
  },
  create: {
    createSchema: createGameSchema,
  },
  update: {
    updateSchema: createGameSchema,
  },
  includeNoPaginationListRoute: true,
})

router = crudRouter({
  table: tournament,
  prefix: '/tournament',
  router,
  list: {
    searchFields: [
      tournament.title,
    ],
    orderBy: tournament.id,
  },
  create: {
    createSchema: createTournamentSchema,
  },
  update: {
    updateSchema: createTournamentSchema,
  },
  includeNoPaginationListRoute: true,
})

router = crudRouter({
  table: opponent,
  prefix: '/opponent',
  router,
  list: {
    searchFields: [
      opponent.name,
    ],
    orderBy: opponent.id,
  },
  create: {
    createSchema: createOpponentSchema,
  },
  update: {
    updateSchema: createOpponentSchema,
  },
  includeNoPaginationListRoute: true,
})

export default useBase('/api/bo', router.handler)
