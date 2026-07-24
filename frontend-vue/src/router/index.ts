import { useGameStore } from '@/stores/game'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// if (import.meta.hot) {
//   handleHotUpdate(router)
// }

export function initRouter(router: Router) {
  router.beforeEach(async (to, from) => {
    const gameStore = useGameStore()
    console.log(`['/lobby', '/board'].includes(${to.path}) && ${!gameStore.lobby}`)
    if (['/lobby', '/board'].includes(to.path) && !gameStore.lobby) {
      console.log('Fetchting current session')
      await gameStore.fetchCurrentSession()
    }

    if (to.path === '/board' && !gameStore.lobby) {
      return '/'
    }

    if (to.path === '/lobby' && !gameStore.lobby && !to.query.code) {
      return '/'
    }

    if (to.path === '/lobby' && !gameStore.lobby && to.query.code) {
      return `/join?code=${to.query.code}`
    }

    if (to.path === '/join' && !to.query.code) {
      return '/'
    }
    console.log('going to', to.fullPath, 'from', from.fullPath)
  })
}

export default router
