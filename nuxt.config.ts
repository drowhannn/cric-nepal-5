// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', 'nuxt-auth-utils', '@nuxt/image'],
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
  ui: {
    global: true,
    icons: ['mdi'],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  vue: {
    propsDestructure: true,
  },
})
