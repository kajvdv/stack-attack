import { describe, test } from 'vitest'
import * as api from '@/api'

describe('Creating game', () => {
  test('Test creating new game endpoint', async () => {
    await api.lobby.createLobby({ creator: 'player', size: 2 })
  })
})
