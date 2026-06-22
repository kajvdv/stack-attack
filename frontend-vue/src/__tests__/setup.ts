import { test as base, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import mockClient from '@/api/mock'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { createApp } from 'vue'
import { createApi } from '@/plugins/client'

export const test = base
  .extend('pinia', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    return pinia
  })
  .extend('router', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: routes,
    })
    return router
  })
  .extend('client', () => {
    return mockClient
  })
  .extend('app', ({ pinia, router, client }) => {
    const app = createApp({
      setup: () => {
        // For no template error
        return () => {}
      },
    })
    app.use(pinia)
    app.use(createApi(client))
    app.use(router)
    const rootEl = document.createElement('div')
    document.body.appendChild(rootEl)
    app.mount(rootEl)
    return app
  })

export { expect }
