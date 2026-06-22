import { test, expect } from './setup'
import { describe, vi } from 'vitest'
import { useGameStore } from '@/stores/game'

describe('Gamestore', () => {
  test('connects with lobby 1234', async ({ pinia, router, app }) => {
    router.push('/board')
    await router.isReady()
    const gameStore = useGameStore()
    await app.runWithContext(gameStore.connect)

    expect(gameStore.game).toBeTruthy()
    expect(gameStore.game?.topcard).toStrictEqual({
      suit: 'hearts',
      value: '2',
    })
  })

  test('play a card', async ({ app, router, client }) => {
    const spy = vi.spyOn(client.lobby, 'messageSpy')
    router.push('/board')
    await router.isReady()
    const gameStore = useGameStore()
    await app.runWithContext(gameStore.connect)
    await app.runWithContext(() => gameStore.play(0))

    expect(spy).toHaveBeenCalledOnce()
  })
})
