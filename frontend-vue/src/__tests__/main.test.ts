import { flushPromises, mount } from '@vue/test-utils'
import { test } from 'vitest'
import { createPinia } from 'pinia'
import { createApi } from '@/plugins/client'
import type { Api } from '@/types/api'
import { createMemoryHistory, createRouter } from 'vue-router'
import { initRouter } from '@/router'
import { routes } from 'vue-router/auto-routes'
import App from '@/App.vue'

const delay = (t: number = 100) => new Promise((resolve) => setTimeout(resolve, t))

const GAME = {
  topcard: {
    suit: 'hearts',
    value: '2',
  },
  previous_topcard: null,
  can_draw: true,
  choose_suit: false,
  draw_count: 0,
  current_player: 'player 1',
  otherPlayers: {},
  hand: [
    {
      suit: 'hearts',
      value: '2',
    },
  ],
  message: 'player 1 joined the game',
}

const lobbies = {} // Represents shared state in the backend
const connections = []
const client: () => Api = () => {
  let currentLobby // Represents cookie
  return {
    lobby: {
      async createLobby({ size, creator }) {
        const lobby = {
          id: 'AAAA',
          capacity: size,
          players: [creator],
          you: creator,
        }
        lobbies['AAAA'] = JSON.parse(JSON.stringify(lobby))
        currentLobby = JSON.parse(JSON.stringify(lobby))
        return JSON.parse(JSON.stringify(lobby))
      },
      async connect(onReceive: (game: object) => Promise<void>) {
        onReceive(GAME)
        connections.push(onReceive)
        return async () => {}
      },
      async join(code, username) {
        console.log(code, username)
        const lobby = lobbies[code]
        lobby.players.push(username)
        currentLobby = JSON.parse(JSON.stringify({ ...lobby, you: username }))
        GAME.otherPlayers[username] = 3
        connections.forEach((conn) => {
          conn(JSON.parse(JSON.stringify(GAME)))
        })
        return JSON.parse(JSON.stringify(currentLobby))
      },
      async getCurrentLobby() {
        const lobby = lobbies['AAAA']
        return JSON.parse(JSON.stringify(lobby))
      },
    },
  }
}

async function createUser() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: routes,
  })
  initRouter(router)

  const wrapper = mount(App, {
    global: {
      plugins: [createApi(client()), router, createPinia()],
    },
  })
  await router.push('/')
  return wrapper
}

// const useLobbyStore1 = defineStore('lobby1', lobbyStoreOptions)
// const useLobbyStore2 = defineStore('lobby2', lobbyStoreOptions)

test('Just some main test file', async () => {
  const player1 = await createUser()
  const player2 = await createUser()

  await player1.find('#create-game-btn').trigger('click')
  await delay()
  await player1.find('#username-input').setValue('player 1')
  await player1.find('#player-count-input').setValue(2)
  await player1.find('#confirm-game-btn').trigger('click')
  await delay()
  console.log(player1.find('#lobby-code-display').text())

  await player2.find('#join-game-input').setValue('AAAA')
  await player2.find('#join-game-btn').trigger('click')
  await delay()

  await player2.find('#prompt-username').setValue('player 2')
  await player2.find('#confirm-username').trigger('click')
  await delay()
  await flushPromises()

  // Beide spelers horen het boord te zien
  console.log(player2.html())
  console.log(player1.html())
})
