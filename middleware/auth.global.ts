export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useUserSession()

  const isAdmin = user.value && user.value.isAdmin

  if (!isAdmin) {
    if (to.path.startsWith('/admin') && !to.path.startsWith('/admin/login'))
      return navigateTo('/admin/login')
  }
  else {
    if (to.path.startsWith('/admin/login'))
      return navigateTo('/admin')
  }

  if (user.value && (to.path.startsWith('/login') || to.path.startsWith('/forgot-password')))
    return navigateTo('/')
})
