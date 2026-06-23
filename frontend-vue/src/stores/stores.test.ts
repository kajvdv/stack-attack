import { describe } from 'vitest'
import { test, expect } from '@/__tests__/setup'
import { useLobbyStore } from './lobby'

describe('Lobby store', () => {
  test('creates new lobby.', async () => {
    const store = useLobbyStore()
    await store.create({ size: 2, creator: 'player 1' })
    expect(store.players).toHaveLength(1)
    expect(store.code).toBe('RRXJ')
  })

  test('get existing lobby', async () => {
    const store = useLobbyStore()
    await store.getLobby('RRXJ')
    expect(store.players).toHaveLength(1)
    expect(store.code).toBe('RRXJ')
  })

  test('get session token after joining', async () => {
    const store = useLobbyStore()
    await store.joinLobby('player 2', 'RRXJ')
    const { name, lobby } = store.currentSession
    expect(name).toBe('player')
    expect(lobby).toBe('RRXJ')
  })

  test('no session token', async () => {
    const store = useLobbyStore()
    const { name, lobby } = store.currentSession
    expect(name).toBe('')
    expect(lobby).toBe('')
  })
})
