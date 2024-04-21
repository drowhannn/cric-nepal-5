import { relations } from 'drizzle-orm'
import { date, integer, pgEnum, pgTable, primaryKey, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export {}

export const userTypeEnum = pgEnum('user_type', ['admin', 'user'])

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', {
    length: 256,
  })
    .unique()
    .notNull(),
  fullName: varchar('full_name', {
    length: 256,
  }).notNull(),
  email: varchar('email', {
    length: 256,
  })
    .notNull()
    .unique(),
  phone: varchar('phone', {
    length: 256,
  }),
  password: varchar('password', {
    length: 256,
  }).notNull(),
  type: userTypeEnum('type').notNull().default('user'),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const userRelations = relations(user, ({ one }) => ({
  team: one(team, {
    fields: [user.id],
    references: [team.ownerId],
  }),
}))

export const playerTypeEnum = pgEnum('player_type', ['batsman', 'bowler', 'allrounder', 'wicketkeeper'])

export const player = pgTable('player', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', {
    length: 256,
  })
    .unique()
    .notNull(),
  fullName: varchar('name', {
    length: 256,
  }).notNull(),
  type: playerTypeEnum('type').notNull(),
  jerseyNumber: varchar('jersey_number', {
    length: 256,
  }),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const playerRelations = relations(player, ({ many }) => ({
  teams: many(teamPlayer),
  games: many(gamePlayer),
  manOfTheMatchGames: many(game),
}))

export const gameTypeEnum = pgEnum('game_type', ['odi', 't20i', 't20', 'od'])

export const tournament = pgTable('tournament', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', {
    length: 256,
  })
    .unique()
    .notNull(),
  title: varchar('title', {
    length: 256,
  }).notNull(),
  details: varchar('details', {
    length: 256,
  }),
  startDate: date('start_date'),
  endDate: date('end_date'),
  type: gameTypeEnum('type').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const tournamentRelations = relations(tournament, ({ many }) => ({
  games: many(game),
}))

export const opponentTypeEnum = pgEnum('opponent_type', ['country', 'club', 'team', 'country-a', 'country-b'])

export const opponent = pgTable('opponent', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', {
    length: 256,
  })
    .unique()
    .notNull(),
  name: varchar('name', {
    length: 256,
  }).notNull(),
  type: opponentTypeEnum('type').notNull(),
  logo: varchar('logo', {
    length: 256,
  }),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const opponentRelations = relations(opponent, ({ many }) => ({
  games: many(game),
}))

export const gameStatusEnum = pgEnum('game_status', ['scheduled', 'in_progress', 'won', 'lost', 'tied'])

export const game = pgTable('game', {
  id: serial('id').primaryKey(),
  title: varchar('title', {
    length: 256,
  }).notNull(),
  slug: varchar('slug', {
    length: 256,
  })
    .unique()
    .notNull(),
  startTime: timestamp('start_time', { mode: 'string' }).defaultNow(),
  endTime: timestamp('end_time', { mode: 'string' }).defaultNow(),
  venue: varchar('venue', {
    length: 256,
  }),
  status: gameStatusEnum('status').notNull().default('scheduled'),
  tournamentId: integer('tournament_id')
    .references(() => tournament.id)
    .notNull(),
  opponentId: integer('opponent_id')
    .references(() => opponent.id)
    .notNull(),
  manOfTheMatchPlayerId: integer('man_of_the_match_player_id').references(() => player.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const gameRelations = relations(game, ({ one, many }) => ({
  tournament: one(tournament, {
    fields: [game.tournamentId],
    references: [tournament.id],
  }),
  opponent: one(opponent, {
    fields: [game.opponentId],
    references: [opponent.id],
  }),
  manOfTheMatchPlayer: one(player, {
    fields: [game.manOfTheMatchPlayerId],
    references: [player.id],
  }),
  players: many(gamePlayer),
}))

export const gamePlayer = pgTable(
  'game_player',
  {
    gameId: integer('game_id')
      .references(() => game.id)
      .notNull(),
    playerId: integer('player_id')
      .references(() => player.id)
      .notNull(),
    runsScored: integer('runs_scored'),
    wicketsTaken: integer('wickets_taken'),
    catchesTaken: integer('catches_taken'),
    stumpings: integer('stumpings'),
    extras: integer('extras'),
    runOuts: integer('run_outs'),
    strikeRate: integer('strike_rate'),
    economy: integer('economy'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (t) => {
    return {
      pk: primaryKey(t.gameId, t.playerId),
    }
  },
)

export const gamePlayerRelations = relations(gamePlayer, ({ one }) => ({
  game: one(game, {
    fields: [gamePlayer.gameId],
    references: [game.id],
  }),
  player: one(player, {
    fields: [gamePlayer.playerId],
    references: [player.id],
  }),
}))

export const team = pgTable('team', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', {
    length: 256,
  })
    .unique()
    .notNull(),
  logo: varchar('logo', {
    length: 256,
  }),
  ownerId: uuid('owner_id').references(() => user.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const teamRelations = relations(team, ({ one, many }) => ({
  owner: one(user, {
    fields: [team.ownerId],
    references: [user.id],
  }),
  players: many(teamPlayer),
}))

export const teamPlayer = pgTable(
  'team_player',
  {
    teamId: uuid('team_id')
      .references(() => team.id)
      .notNull(),
    playerId: integer('player_id')
      .references(() => player.id)
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (t) => {
    return {
      pk: primaryKey(t.teamId, t.playerId),
    }
  },
)

export const teamPlayerRelations = relations(teamPlayer, ({ one }) => ({
  team: one(team, {
    fields: [teamPlayer.teamId],
    references: [team.id],
  }),
  player: one(player, {
    fields: [teamPlayer.playerId],
    references: [player.id],
  }),
}))
