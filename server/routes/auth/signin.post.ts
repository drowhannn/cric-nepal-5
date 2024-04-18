import { eq } from 'drizzle-orm'
import { user } from '~/db/schema'
import { signInSchema } from '~/db/zod'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readValidatedBody(event, signInSchema.parse)
  const { email, password } = body
  const loggedUser = await db.query.user.findFirst({ where: eq(user.email, email) })
  if (!loggedUser) {
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const passwordMatch = verifyHash(password, loggedUser.password)

  if (!passwordMatch) {
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  await setUserSession(event, { user: {
    id: loggedUser.id,
    email: loggedUser.email,
    fullName: loggedUser.fullName,
    phone: loggedUser.phone,
    username: loggedUser.username,
    isAdmin: loggedUser.type === 'admin',
  },
  })

  return {
    success: true,
  }
})
