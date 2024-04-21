import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { game, opponent, player, tournament } from '../schema'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signUpSchema = signInSchema.extend({
  username: z.string().min(3),
  fullName: z.string().min(3),
  phone: z.string().min(10).optional(),
  confirmPassword: z.string().min(6),
})

const playerBaseSchema = createInsertSchema(player).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const createPlayerSchema = playerBaseSchema

const tournamentBaseSchema = createInsertSchema(tournament).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const createTournamentSchema = tournamentBaseSchema

const opponentBaseSchema = createInsertSchema(opponent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const createOpponentSchema = opponentBaseSchema

const gameBaseSchema = createInsertSchema(game).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const createGameSchema = gameBaseSchema
