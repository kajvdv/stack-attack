import { vi, describe } from 'vitest'
import { test, expect, LOBBY } from '@/__tests__/setup'
import { useGameStore } from '@/stores/game'
import * as api from '@/api'

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
