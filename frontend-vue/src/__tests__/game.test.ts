import { test, expect } from './setup'
import { useGameStore } from '@/stores/game'

test('GameStore connects with lobby 1234', async ({ pinia, router, app }) => {
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

//
