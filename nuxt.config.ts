// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  devServer: {
    port: 3020
  },
  runtimeConfig: {
    apiBase: '',
    url: '',
    public: {
      apiBase: '',
      pusherKey: '',
      pusherCluster: '',
    }
  },
})
