import { useGameStore } from '@/stores/game'
import { useLobbyStore } from '@/stores/lobby'
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
    const lobbyStore = useLobbyStore()
    // console.log(`['/lobby', '/board'].includes(${to.path}) && ${!gameStore.lobby}`)
    if (['/lobby', '/board'].includes(to.path) && !lobbyStore.lobby) {
      console.log('Fetchting current session')
      await lobbyStore.fetchCurrentSession()
    }
    if (to.path === '/board' && !lobbyStore.lobby) {
      return '/'
    }
    if (to.path === '/lobby' && !lobbyStore.lobby && !to.query.code) {
      return '/'
    }
    // if (to.path === '/lobby' && !gameStore.lobby && to.query.code) {
    //   return `/join?code=${to.query.code}`
    // }
    // if (to.path === '/join' && !to.query.code) {
    //   return '/'
    // }
    // console.log('going to', to.fullPath, 'from', from.fullPath)
  })
}

export default router
