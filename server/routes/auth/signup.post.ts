import { eq } from 'drizzle-orm'
import { signUpSchema } from '~/db/zod'
import { user } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const {
    email,
    password,
    fullName,
    phone,
    username,
    confirmPassword,
  } = await readValidatedBody(event, signUpSchema.parse)

  if (password !== confirmPassword) {
    throw createError({
      message: 'Passwords do not match',
      statusCode: 400,
    })
  }

  const db = useDB()
  const existingUserWithEmail = await db.query.user.findFirst({
    where: eq(user.email, email),
  })
  if (existingUserWithEmail) {
    throw createError({
      message: 'User already exists with this email',
      statusCode: 400,
    })
  }

  const existingUserWithUsername = await db.query.user.findFirst({
    where: eq(user.username, username),
  })

  if (existingUserWithUsername) {
    throw createError({
      message: 'User already exists with this username',
      statusCode: 400,
    })
  }

  const hashedPassword = generateHash(password)
  const [newUser] = await db.insert(user).values({
    email,
    password: hashedPassword,
    fullName,
    phone,
    username,
  }).returning()

  await setUserSession(event, {
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      phone: newUser.phone,
      username: newUser.username,
      isAdmin: false,
    },
  })

  return {
    success: true,
  }
})
