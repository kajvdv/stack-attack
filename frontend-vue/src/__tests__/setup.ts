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

export const LOBBY = {
  id: 'AAAA',
  players: ['player 1'],
  capacity: 2,
  you: 'player 1',
}

export const GAME = {
  topcard: {
    suit: 'hearts',
    value: '2',
  },
  previous_topcard: null,
  can_draw: true,
  choose_suit: false,
  draw_count: 0,
  current_player: 'player 1',
  otherPlayers: {
    'player 2': 2,
  },
  hand: [
    {
      suit: 'hearts',
      value: '2',
    },
  ],
  message: 'player 1 joined the game',
}

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
