// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  appId: "app",
  future: { compatibilityVersion: 4 },
  modules: ["@nuxt/ui", "@nuxt/image", "@sidebase/nuxt-auth", '@nuxtjs/mdc'],
  css: [
    '@/assets/css/main.css'
  ],
  runtimeConfig: {
    auth: {
      secret: process.env.SECRET_KEY,
      origin: process.env.AUTH_ORIGIN
    },
    aiApi: process.env.OPENAI_API,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    dbUrl: process.env.DATABASE_URL
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: true
  },
  app: {
    head: {
      htmlAttrs: { lang: "ru" },
    }
  },
icon: {
      serverBundle: {
      remote: "jsdelivr",
      // externalizeIconsJson: true,
    },
},
});