import { vi, describe } from 'vitest'
import { test, expect, LOBBY } from '@/__tests__/setup'
import { flushPromises, mount } from '@vue/test-utils'
import { HomeCard, NewGameCard, JoinCard, LobbyCard } from '@/components/menu'
import { useGameStore } from '@/stores/game'
import { mockedStore } from '../mockedStore'
import { useLobbyStore } from '@/stores/lobby'

describe('HomeCard', () => {
  test('HomeCard displays right elements', async () => {
    const wrapper = mount(HomeCard)

    expect(wrapper.find('#join-game-input').exists()).toBe(true)
    expect(wrapper.find('#join-game-btn').exists()).toBe(true)
  })

  test('Join game should navigatie to /join with query param', async ({ router }) => {
    const wrapper = mount(HomeCard)
    const spy = vi.spyOn(router, 'push')

    await wrapper.find('#join-game-input').setValue('AAAA')
    await wrapper.find('#join-game-btn').trigger('click')

    expect(spy).toHaveBeenCalledExactlyOnceWith('/join?code=AAAA')
  })

  test('Create game button navigates to /new', async ({ router }) => {
    const wrapper = mount(HomeCard)
    const spy = vi.spyOn(router, 'push')

    await wrapper.find('#create-game-btn').trigger('click')

    expect(spy).toHaveBeenCalledExactlyOnceWith('/new')
  })
})

describe('NewGameCard', () => {
  test('NewGameCard displays right elements', async () => {
    const wrapper = mount(NewGameCard)
  })

  test('Back to home link navigates to /', async ({ router }) => {
    const wrapper = mount(NewGameCard)
    const spy = vi.spyOn(router, 'push')

    await wrapper.find('#back-home-link').trigger('click')

    expect(spy).toHaveBeenCalledExactlyOnceWith('/')
  })

  test('Confirm button navigates to /lobby', async ({ router }) => {
    const wrapper = mount(NewGameCard)
    const spy = vi.spyOn(router, 'push')

    await wrapper.find('#username-input').setValue('player 1')
    await wrapper.find('#player-count-input').setValue('2')
    await wrapper.find('#confirm-game-btn').trigger('click')

    expect(spy).toHaveBeenCalledExactlyOnceWith('/lobby')
  })

  test('Display error at name field when error in store')
})

describe('JoinCard', () => {
  test('JoinCard displays right elements', async () => {
    const wrapper = mount(JoinCard)

    expect(wrapper.find('#prompt-username').exists()).toBe(true)
    expect(wrapper.find('#confirm-username').exists()).toBe(true)
  })

  test('Join after choosing name should call join on gameStore', async () => {
    const wrapper = mount(JoinCard)
    const gameStore = useGameStore()
    const spy = vi.spyOn(gameStore, 'join')

    await wrapper.find('#prompt-username').setValue('player 2')
    await wrapper.find('#confirm-username').trigger('click')

    expect(spy).toHaveBeenCalledOnce()
  })

  test('Display an error that is in store')
})

describe('LobbyCard', () => {
  test('LobbyCard displays right elements', async () => {
    const wrapper = mount(LobbyCard)

    expect(wrapper.find('#lobby-code-display').exists()).toBe(true)
  })

  test('LobbyCard displays lobby code from store', async () => {
    const wrapper = mount(LobbyCard)
    const gameStore = mockedStore(useGameStore)
    gameStore.lobbyCode = 'AAAA'

    await flushPromises()
    expect(wrapper.find('#lobby-code-display').text()).toBe('AAAA')
  })
})

// describe('Joining a game', () => {
//   test.only('LobbyCard should call router with /board when lobby is full', async ({ router }) => {
//     const wrapper = mount(LobbyCard)
//     const spy = vi.spyOn(router, 'push')
//     const lobbyStore = mockedStore(useLobbyStore)
//     lobbyStore.lobby = { ...LOBBY, players: ['player 1', 'player 2'] }

//     await flushPromises()
//     expect(spy).toHaveBeenCalledWith('/board')
//   })
// })
