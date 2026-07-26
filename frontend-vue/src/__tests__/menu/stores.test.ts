import { vi, describe } from 'vitest'
import { test, expect, LOBBY, GAME, delay } from '@/__tests__/setup'
import { useGameStore } from '@/stores/game'
import * as api from '@/api'
import { flushPromises } from '@vue/test-utils'
import { useLobbyStore } from '@/stores/lobby'

describe('gameStore', () => {
  test('Save received game', async ({ app }) => {
    const gameStore = useGameStore()
    const lobbyStore = useLobbyStore()
    await lobbyStore.joinLobby('AAAA', 'player 1')
    await gameStore.connect()
    expect(gameStore.game).toStrictEqual(GAME)
  })
  test('Making lobbyStore refetch when player joins', async ({ app }) => {
    const gameStore = useGameStore()
    const lobbyStore = useLobbyStore()
    await lobbyStore.joinLobby('AAAA', 'player 1')
    const spy = vi.spyOn(lobbyStore, 'fetchCurrentLobby')
    await gameStore.connect()

    expect(spy).toHaveBeenCalled()
  })
  test.only('Cant connect when no session', async ({ app }) => {
    const gameStore = useGameStore()

    await expect(async () => await gameStore.connect()).rejects.toThrow('No lobby in store')
  })
})

describe('lobbyStore', () => {
  test('Saving newly created game')
  test('Join without parameters')
  test('Joining a lobby and storing in store', async ({ app }) => {
    const lobbyStore = useLobbyStore()
    await lobbyStore.joinLobby('AAAA', 'player 2')
    expect(lobbyStore.lobby).toStrictEqual(LOBBY)
  })
  test('Get current joined game from server', async ({ app }) => {
    const lobbyStore = useLobbyStore()
    await lobbyStore.fetchCurrentSession()
    expect(lobbyStore.lobby).toStrictEqual(LOBBY)
  })
  test('Saving current game', async ({ app }) => {
    const spy = vi.spyOn(api.lobby, 'getCurrentLobby')
    const lobbyStore = useLobbyStore()
    await lobbyStore.fetchCurrentLobby()
    expect(spy).toHaveBeenCalledOnce()
    expect(lobbyStore.lobby).toStrictEqual(LOBBY)
  })
  test('Navigating to /lobby when new game was created')
  test('LobbyStore navigates to /board when fetched lobby is full', async ({ app, router }) => {
    vi.mocked(api.lobby.getCurrentLobby).mockResolvedValue({
      ...LOBBY,
      players: ['player 1', 'player 2'],
    })
    const spy = vi.spyOn(router, 'push')
    const lobbyStore = useLobbyStore()
    lobbyStore.fetchCurrentLobby()

    await flushPromises()
    expect(spy).toHaveBeenCalledExactlyOnceWith('/board')
  })
})

// describe('Creating a game', () => {
//   test('gameStore saves game', () => {
//     async function connect(onReceive: (game: object) => Promise<void>) {
//       onReceive(GAME)
//       return async () => {}
//     }
//     vi.mocked(api.lobby.connect).mockImplementation(connect)
//   })
// })

// describe('Joining a game', () => {
//   test('gameStore makes lobbyStore fetch lobby on changed players in message', async ({ app }) => {
//     const lobbyStore = useLobbyStore()
//     const spy = vi.spyOn(lobbyStore, 'fetchCurrentLobby')
//     const gameStore = useGameStore()
//     gameStore.game = GAME
//     await gameStore.connect()
//     expect(spy).toHaveBeenCalled()
//   })
// })
