import { describe, test, beforeEach, expect } from 'vitest'
import { useLobbyStore } from './lobby'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createApi } from '@/plugins/client'
import api, { setSession } from '@/api/mock'

beforeEach(() => {
  const app = createApp({})
  const pinia = createPinia()
  app.use(pinia)
  app.use(createApi(api))
  setActivePinia(pinia)
})

describe('Lobby store', () => {
  let store: ReturnType<typeof useLobbyStore>
  beforeEach(() => {
    store = useLobbyStore()
  })

  test('creates new lobby.', async () => {
    await store.create({ size: 2, creator: 'player 1' })
    expect(store.players).toHaveLength(1)
    expect(store.code).toBe('RRXJ')
  })

  test('get existing lobby', async () => {
    await store.getLobby('RRXJ')
    expect(store.players).toHaveLength(1)
    expect(store.code).toBe('RRXJ')
  })

  test('get sesion token', async () => {
    const { name, lobby } = store.currentSession
    expect(name).toBe('player')
    expect(lobby).toBe('RRXJ')
  })

  test('no session token', async () => {
    setSession(false)
    const { name, lobby } = store.currentSession
    expect(name).toBe('')
    expect(lobby).toBe('')
  })
})
