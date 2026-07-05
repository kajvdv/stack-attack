import { setActivePinia, createPinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { config } from '@vue/test-utils'
import { test as base, expect, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { createApp } from 'vue'
import { createApi } from '@/plugins/client'
import { initRouter } from '@/router'
import * as api from '@/api'

vi.mock('@/api')

export const test = base
  .extend('pinia', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    return pinia
  })
  .extend('router', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: routes,
    })
    console.log('initing router')
    initRouter(router)
    return router
  })
  .extend('app', async ({ pinia, router }) => {
    // Used for Pinia unit testing
    const app = createApp({
      setup() {
        // suppress missing template warning
        return () => {}
      },
    })
    app.use(pinia)
    app.use(router)
    app.use(createApi(api))
    // await router.isReady()
    return app
  })

test.beforeEach(async ({ router }) => {
  config.global.plugins = [createApi(api), createTestingPinia(), router]
})

test.afterEach(() => {
  vi.resetAllMocks()
})

export const delay = (t: number = 100) => new Promise((resolve) => setTimeout(resolve, t))

export { expect }
