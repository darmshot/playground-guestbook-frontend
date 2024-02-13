// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  devServer: {
    port: 3020
  },
  runtimeConfig: {
    apiBase: '', // can be overridden by NUXT_API_SECRET environment variable
    public: {
      apiBase: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      pusherKey: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      pusherCluster: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    }
  },
})
