import { test as base, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { createApp } from 'vue'
import { createApi } from '@/plugins/client'
import { config } from '@vue/test-utils'

export const test = base
  .extend('pinia', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    return pinia
  })
  .extend('router', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: routes,
    })
    router.push('/')
    await router.isReady()
    return router
  })
  .extend('client', async () => {
    const mockClient = await import('@/api/mock')
    return mockClient
  })
  .extend('app', () => {
    const app = createApp({
      setup: () => {
        // For no template error
        return () => {}
      },
    })
    return app
  })

test.beforeEach(({ app, pinia, router, client }) => {
  config.global.plugins = [createApi(client), createTestingPinia({ stubActions: false }), router]
  // This for Pinia to work
  app.use(pinia)
  app.use(createApi(client))

  // app.use(router)
  // const rootEl = document.createElement('div')
  // document.body.appendChild(rootEl)
  // app.mount(rootEl)
})

test.afterEach(() => {
  vi.resetModules()
})

export { expect }
