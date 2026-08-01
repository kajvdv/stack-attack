import { createApi } from '@/plugins/client'
import { useLobbyStore } from '@/stores/lobby'
import { setActivePinia, createPinia } from 'pinia'
import { test, vi, describe, expect, beforeEach } from 'vitest'
import { createApp } from 'vue'
import * as api from '@/api'
import { useGameStore } from '@/stores/game'
import router, { initRouter } from '@/router'
import type { Lobby, LobbyCreate, LobbyResponse } from '@/types/lobby'
import type { Game } from '@/types/game'
import { flushPromises } from '@vue/test-utils'

export const delay = (t: number = 100) => new Promise((resolve) => setTimeout(resolve, t))

const client = vi.hoisted(() => {
  let currentLobby: LobbyResponse | undefined = undefined
  const connections: ((game: object) => Promise<void>)[] = []
  const game = {
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
  return {
    lobby: {
      async createLobby({ creator, size }: LobbyCreate) {
        console.log(connections, 'should be empty')
        currentLobby = {
          id: 'AAAA',
          players: [creator],
          capacity: size,
          you: creator,
        }
        return { ...currentLobby }
      },
      async join(code: string, username: string) {
        if (!currentLobby) {
          throw new Error('No lobby joined')
        }
        game.otherPlayers[username] = 2
        const newLobby = { ...currentLobby, players: [...currentLobby.players, username] }
        currentLobby = newLobby
        console.log('Sending new game', game)
        connections.forEach(async (conn) => conn(game))
        return newLobby
      },
      async getCurrentLobby() {
        if (!currentLobby) {
          throw new Error('No lobby joined')
        }
        return { ...currentLobby }
      },
      async connect(onReceive: (game: object) => Promise<void>) {
        connections.push(onReceive)
        onReceive(game)
        return async () => {}
      },
    },
  }
})

vi.mock('@/api', () => client)

beforeEach(() => {
  vi.resetAllMocks()
  vi.clearAllMocks()
  client.reset
})

function setupPinia() {
  const app = createApp({})
  const pinia = createPinia()
  app.use(createApi(api))
  app.use(pinia)
  initRouter(router)
  app.use(router)
  setActivePinia(pinia)
  return { router }
}

describe('Player creates a new game', () => {
  test('lobbStore contains newly created game', async () => {
    setupPinia()

    const lobbyStore = useLobbyStore()
    await lobbyStore.createLobby({
      creator: 'player 1',
      size: 2,
    })
    expect(lobbyStore.lobby).toStrictEqual({
      id: 'AAAA',
      players: ['player 1'],
      capacity: 2,
      you: 'player 1',
    })
  })
})

describe('Waiting in the lobby', () => {
  test('Update lobby when a new player connects', async () => {
    const { router } = setupPinia()
    await router.push('/lobby')

    const lobbyStore = useLobbyStore()
    const gameStore = useGameStore()

    await lobbyStore.createLobby({
      creator: 'player 1',
      size: 2,
    })
    await gameStore.connect()
    // player two calls this in another browser
    await api.lobby.join('AAAA', 'player 2')
    await flushPromises()
    await delay()

    expect(lobbyStore.players).toStrictEqual(['player 1', 'player 2'])
    expect(router.currentRoute.value.fullPath).toBe('/board')
  })
  test('LobbyCard displays lobby in lobbyStore')
  test('Redirect to board when last player joins', async () => {
    const { router } = setupPinia()

    // Creating lobby as player 2
    await api.lobby.createLobby({
      creator: 'player 2',
      size: 2,
    })

    const lobbyStore = useLobbyStore()
    const gameStore = useGameStore()

    lobbyStore.joinLobby('AAAA', 'player 1')
    await router.push('/lobby')

    expect(router.currentRoute.value.fullPath).toBe('/board')
    asdf
  })
})
