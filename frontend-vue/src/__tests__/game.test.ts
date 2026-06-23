import { test, expect } from './setup'
import { describe, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useGameStore } from '@/stores/game'
import { Hand, PlayingCard } from '@/components/board'

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

  test('clicking on card in Hand sends message', async ({ client }) => {
    const spy = vi.spyOn(client.lobby, 'messageSpy')
    const wrapper = mount(Hand, {
      props: {
        cards: [{ suit: 'spades', value: 'ace' }],
      },
    })
    // Important to first mount the component before calling any Pinia stores.
    const gameStore = useGameStore()
    await gameStore.connect()
    const cards = wrapper.findAllComponents(PlayingCard)
    await cards.at(0)?.trigger('click')
    expect(spy).toHaveBeenCalledExactlyOnceWith('0')
  })
})
