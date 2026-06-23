import { test, expect } from './setup'
import { describe, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useGameStore } from '@/stores/game'
import { Hand, PlayingCard, DrawStack } from '@/components/board'
import Board from '@/pages/board.vue'

describe('Gamestore', () => {
  test('display opponent cards correctly', async ({ client }) => {
    const wrapper = mount(Board)
    await client.lobby.sendMessage({
      otherPlayers: {
        player2: 2,
      },
      topcard: {
        suit: 'hearts',
        value: '2',
      },
    })
    const hands = await wrapper.findAllComponents(Hand)
    const cards = hands.at(0)?.findAllComponents(PlayingCard)
    expect(cards).toHaveLength(2)
  })

  test('connects with lobby 1234', async ({ client, router, app }) => {
    await router.push('/board')
    const gameStore = useGameStore()
    await app.runWithContext(gameStore.connect)
    await client.lobby.sendMessage({
      otherPlayers: {
        player2: 2,
      },
      topcard: {
        suit: 'hearts',
        value: '2',
      },
    })

    expect(gameStore.otherPlayers).toBeTruthy()
    expect(gameStore.topcard).toStrictEqual({
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

  test('drawing card', async ({ client }) => {
    const spy = vi.spyOn(client.lobby, 'messageSpy')
    const wrapper = mount(DrawStack)
    const gameStore = useGameStore()
    await gameStore.connect()
    await wrapper.trigger('click')

    expect(spy).toHaveBeenCalledExactlyOnceWith('-1')
  })
})
