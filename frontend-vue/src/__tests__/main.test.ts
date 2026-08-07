import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test } from 'vitest'
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

function createBackend() {
  const lobbies = {}
  const connections = []
  function createClient() {
    let currentLobby
    const client = {
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
          if (!lobby) {
            return null
          } else {
            return JSON.parse(JSON.stringify(lobby))
          }
        },
      },
    }
    return client
  }

  const sendMessage = (username: string, msg: object) => {
    connections.forEach((conn) => {
      conn(msg)
    })
  }
  return { createClient, lobbies, sendMessage }
}

function createTheRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: routes,
  })
  initRouter(router)
  return router
}

async function createUser(client = undefined, router = undefined) {
  if (!router) {
    router = createTheRouter()
  }

  const wrapper = mount(App, {
    global: {
      plugins: [createApi(client), router, createPinia()],
    },
  })
  await router.push('/')
  return wrapper
}

test('Just some main test file', async () => {
  const { createClient, lobbies } = createBackend()
  const player1 = await createUser(createClient())
  const player2 = await createUser(createClient())

  await player1.find('#create-game-btn').trigger('click')
  await delay()
  await player1.find('#username-input').setValue('player 1')
  await player1.find('#player-count-input').setValue(3)
  await player1.find('#confirm-game-btn').trigger('click')
  await delay()
  console.log(player1.find('#lobby-code-display').text())

  await player2.find('#join-game-input').setValue('AAAA')
  await player2.find('#join-game-btn').trigger('click')
  await delay()

  await player2.find('#prompt-username').setValue('player 2')
  await player2.find('#confirm-username').trigger('click')
  await flushPromises()
  await delay()

  // Beide spelers horen te zien dat ze wachten op een derde speler
  console.log(player1.html())
  console.log(player2.html())
})

describe('Redirect to /', () => {
  let player
  let router
  beforeEach(async () => {
    const { createClient, lobbies } = createBackend()
    router = createTheRouter()
    player = await createUser(createClient(), router)
  })

  test('for /lobby when nothing in store', async () => {
    await router.push('/lobby')
    await flushPromises()
    await delay()

    console.log(player.html())
  })

  test('for /board when nothing in store', async () => {
    await router.push('/board')
    await flushPromises()
    await delay()

    console.log(player.html())
  })
})

test('Testing game interactions', async () => {
  const { createClient, lobbies, sendMessage } = createBackend()
  const clients = [createClient(), createClient()]
  const routers = [createTheRouter(), createTheRouter()]

  // Setup fake backend/client
  await clients[0].lobby.createLobby({ creator: 'player 1', size: 2 })
  await clients[1].lobby.join('AAAA', 'player 2')

  const player1 = await createUser(clients[0], routers[0])
  const player2 = await createUser(clients[1], routers[1])

  await routers[0].push('/board')
  // Testing how it behaves when receiving an error

  await flushPromises()
  await delay()
  console.log(player1.html())
  sendMessage('player 1', { error: 'Invalid choose' })
  console.log('-----')
  await flushPromises()

  // Testing when topcard changes
  sendMessage('player 1', {
    topcard: { suit: 'hearts', value: 'jack' },
    previous_topcard: { suit: 'hearts', value: 'queen' },
    can_draw: true,
    choose_suit: false,
    draw_count: 0,
    current_player: 'player 2',
    otherPlayers: { 'player 2': 8 },
    hand: [
      { suit: 'spades', value: '5' },
      { suit: 'clubs', value: '9' },
      { suit: 'diamonds', value: '5' },
      { suit: 'hearts', value: 'king' },
      { suit: 'hearts', value: '8' },
      { suit: 'diamonds', value: '8' },
      { suit: 'spades', value: 'ace' },
    ],
    message: 'player 1 joined the game',
  })
  await flushPromises()

  expect(player1.find('#top-card').attributes().src).toBe('/cards/jack_of_hearts.png')
})
