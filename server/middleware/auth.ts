export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session.user
  event.context.user = user

  const isAdmin = user && user.isAdmin

  const path = event.path

  if (!isAdmin && path.startsWith('/admin/bo')) {
    return createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
})
