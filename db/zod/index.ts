import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { player } from '../schema'

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
