import { describe, vi } from 'vitest'
import { test, expect, delay, GAME, LOBBY } from './setup'
import { mockedStore } from './mockedStore'
import { flushPromises, mount } from '@vue/test-utils'
import App from '@/App.vue'
import Board from '@/pages/board.vue'
import { useLobbyStore } from '@/stores/lobby'
import { useGameStore } from '@/stores/game'

describe('Home screen', () => {
  test('Display elements', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/')

    expect(wrapper.find('#create-game-btn').exists()).toBe(true)
    expect(wrapper.find('#join-game-input').exists()).toBe(true)
    expect(wrapper.find('#join-game-btn').exists()).toBe(true)
  })

  test('Create game navigates to /new', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/')

    await wrapper.find('#create-game-btn').trigger('click')

    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/new')
  })

  test('Join lobby with code', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/')

    await wrapper.find('#join-game-input').setValue('AAAA')
    await wrapper.find('#join-game-btn').trigger('click')

    await flushPromises()
    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/join?code=AAAA')
  })
})

describe('Create new game on /new', () => {
  test('Create new game screen', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/new')

    expect(wrapper.find('#back-home-link').exists()).toBe(true)
    expect(wrapper.find('#username-input').exists()).toBe(true)
    expect(wrapper.find('#player-count-input').exists()).toBe(true)
    expect(wrapper.find('#confirm-game-btn').exists()).toBe(true)
  })

  test('Check back home link works', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/new')

    await wrapper.find('#back-home-link').trigger('click')

    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/')
  })

  test('Create game form calls store', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/new')
    const gameStore = useGameStore()
    const spy = vi.spyOn(gameStore, 'create')

    await wrapper.find('#username-input').setValue('player')
    await wrapper.find('#player-count-input').setValue(2)
    await wrapper.find('#confirm-game-btn').trigger('click')

    await flushPromises()
    expect(spy).toHaveBeenCalledExactlyOnceWith(2, 'player')
  })
})

describe('Joining page', () => {
  test('Display join page', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/join?code=AAAA')

    expect(wrapper.find('#prompt-username').exists()).toBe(true)
    expect(wrapper.find('#confirm-username').exists()).toBe(true)
  })

  test('Join page without query parameter redirect to /', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/join')

    await flushPromises()
    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/')
  })

  test('Called join on the store after choosing name', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/join?code=AAAA')
    const gameStore = useGameStore()
    const spy = vi.spyOn(gameStore, 'join')

    await wrapper.find('#prompt-username').setValue('player 2')
    await wrapper.find('#confirm-username').trigger('click')

    expect(spy).toHaveBeenCalledExactlyOnceWith('AAAA', 'player 2')
  })
})

describe('Lobby page', () => {
  test('Lobby screen when lobby joined', async ({ router }) => {
    const wrapper = mount(App)
    const gameStore = useGameStore()
    gameStore.lobby = {
      id: 'AAAA',
      players: ['player 1'],
      capacity: 4,
      you: 'player 1',
    }
    await router.push('/lobby')

    await flushPromises()
    expect(wrapper.find('#lobby-code-display').text()).toBe('AAAA')
  })

  test('Navigating to /lobby without a lobby and code should put route to home', async ({
    router,
  }) => {
    const wrapper = mount(App)
    await router.push('/lobby')

    await flushPromises()
    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/')
  })

  test('Navigating to lobby with code but no cookie should redirect to /join', async ({
    router,
  }) => {
    const wrapper = mount(App)
    await router.push('/lobby?code=AAAA')

    await flushPromises()
    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/join?code=AAAA')
  })

  test('Navigating to lobby with old code should ignore cookie', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/lobby?code=AAAA')
    const gameStore = useGameStore()
    gameStore.lobby = {
      id: 'BBBB',
      players: ['player 1'],
      capacity: 4,
      you: 'player 1',
    }

    expect(wrapper.find('#prompt-username').exists()).toBe(true)
    expect(wrapper.find('#confirm-username').exists()).toBe(true)
  })
})

describe('Board page', () => {
  test('Display board on valid session', async ({ router }) => {
    const wrapper = mount(Board)
    const gameStore = mockedStore(useGameStore)
    gameStore.topcard = { suit: 'spades', value: '4' }
    // gameStore.lobby = LOBBY

    expect(wrapper.find('#top-card').exists()).toBe(true)
    expect(wrapper.find('#draw-stack').exists()).toBe(true)
    expect(wrapper.find('#own-hand').exists()).toBe(true)
    expect(wrapper.find('#message-display').exists()).toBe(true)
  })
  test('Redirect to / if no session', async ({ router }) => {
    const wrapper = mount(App)
    await router.push('/board')

    await flushPromises()
    await delay()
    expect(router.currentRoute.value.fullPath).toBe('/')
  })
  test('Right card images are shown', async ({ router }) => {
    const wrapper = mount(App)
    const gameStore = useGameStore()
    gameStore.game = GAME
    gameStore.lobby = LOBBY
    await router.push('/board')

    await flushPromises()
    const img = wrapper.find<HTMLImageElement>('#top-card').element
    expect(img.src.split('/').at(-1)).toBe('2_of_hearts.png')
  })
  test('Card sends the right index to the websocket', async ({ router }) => {
    const wrapper = mount(App)
    const gameStore = useGameStore()
    const spy = vi.spyOn(gameStore, 'play')
    gameStore.game = {
      // There should be no need to set the whole game, just the hand is okay
      ...GAME,
      hand: [
        {
          suit: 'hearts',
          value: '2',
        },
        {
          suit: 'hearts',
          value: '3',
        },
      ],
    }
    gameStore.lobby = LOBBY
    await router.push('/board')

    const cards = wrapper.findAll('#own-hand [data-testid=card]')
    await cards.at(1)?.trigger('click')
    expect(spy).toHaveBeenCalledExactlyOnceWith(1)
  })
  test('Card sends the message when drawing a card', async () => {
    const wrapper = mount(Board)
    const gameStore = mockedStore(useGameStore)
    const spy = vi.spyOn(gameStore, 'draw')
    gameStore.canDraw = true

    await wrapper.find('#draw-stack').trigger('click')

    expect(spy).toHaveBeenCalledOnce()
  })
  test('Player indicator shows at the second player', async ({ router }) => {
    const wrapper = mount(Board)
    const gameStore = mockedStore(useGameStore)
    gameStore.currentPlayer = 'player 2'
    gameStore.players = ['player 1', 'player 2']

    await flushPromises()
    const hands = wrapper.findAll<HTMLDivElement>('[data-testid=hand]')

    expect(hands.at(1)?.find('#player-indicator').exists()).toBe(true)
    expect(hands.at(0)?.find('#player-indicator').exists()).toBe(false)
  })
  test('Message of the game is displayed', async () => {
    const wrapper = mount(Board)
    const gameStore = mockedStore(useGameStore)
    gameStore.message = 'test'

    await flushPromises()

    expect(wrapper.find('#message-display').text()).toBe('test')
  })
  // Test general unvalid game objects
})
