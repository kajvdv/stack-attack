import { vi, describe } from 'vitest'
import { test, expect, LOBBY, GAME, delay } from '@/__tests__/setup'
import { useGameStore } from '@/stores/game'
import * as api from '@/api'
import { flushPromises } from '@vue/test-utils'

describe('gameStore', () => {
  test('Joining a lobby and storing in store', async ({ app }) => {
    vi.spyOn(api.lobby, 'join').mockImplementation(async () => LOBBY)
    const gameStore = useGameStore()

    await gameStore.join('AAAA', 'player 2')
    expect(gameStore.lobby).toStrictEqual(LOBBY)
  })

  test('Join without parameters')

  test('Get current joined game from server', async ({ app }) => {
    vi.spyOn(api.lobby, 'getCurrentLobby').mockImplementation(async () => LOBBY)
    const gameStore = useGameStore()

    await gameStore.fetchCurrentSession()
    expect(gameStore.lobby).toStrictEqual(LOBBY)
  })
})

describe('Joining a game', () => {
  test.only('Store pushes /board when game full', async ({ app, router }) => {
    async function connect(onReceive: (game: object) => Promise<void>) {
      onReceive({
        ...GAME,
        otherPlayers: {
          'player 1': 2,
          'player 2': 2,
        },
      })
      return async () => {}
    }
    vi.mocked(api.lobby.join).mockResolvedValue(LOBBY)
    vi.mocked(api.lobby.connect).mockImplementation(connect)
    vi.mocked(api.lobby.getCurrentLobby).mockResolvedValue({
      ...LOBBY,
      players: ['player 1', 'player 2'],
    })
    const spy = vi.spyOn(router, 'push')
    const gameStore = useGameStore()
    await gameStore.join('AAAA', 'player 2')
    await gameStore.connect()

    await flushPromises()

    expect(spy).toHaveBeenCalledWith('/board')
  })
})
