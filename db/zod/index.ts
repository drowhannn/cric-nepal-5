import z from 'zod'

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
