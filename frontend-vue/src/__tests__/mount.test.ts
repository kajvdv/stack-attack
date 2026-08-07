// import { describe, vi } from 'vitest'
// import { test, expect, delay } from './setup'
// import { flushPromises, mount } from '@vue/test-utils'
// import App from '@/App.vue'
// import { useLobbyStore } from '@/stores/lobby'
// import { useGameStore } from '@/stores/game'

// describe('Home screen', () => {
//   test('Display elements', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/')

//     expect(wrapper.find('#create-game-btn').exists()).toBe(true)
//     expect(wrapper.find('#join-game-input').exists()).toBe(true)
//     expect(wrapper.find('#join-game-btn').exists()).toBe(true)
//   })

//   test('Create game navigates to /new', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/')

//     await wrapper.find('#create-game-btn').trigger('click')

//     await delay()
//     expect(router.currentRoute.value.fullPath).toBe('/new')
//   })

//   test('Join lobby with code', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/')

//     await wrapper.find('#join-game-input').setValue('AAAA')
//     await wrapper.find('#join-game-btn').trigger('click')

//     await flushPromises()
//     await delay(1000)
//     expect(router.currentRoute.value.fullPath).toBe('/join?code=AAAA')
//   })
// })

// describe('Create new game on /new', () => {
//   test('Create new game screen', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/new')

//     expect(wrapper.find('#back-home-link').exists()).toBe(true)
//     expect(wrapper.find('#username-input').exists()).toBe(true)
//     expect(wrapper.find('#player-count-input').exists()).toBe(true)
//     expect(wrapper.find('#confirm-game-btn').exists()).toBe(true)
//   })

//   test('Check back home link works', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/new')

//     await wrapper.find('#back-home-link').trigger('click')

//     await delay()
//     expect(router.currentRoute.value.fullPath).toBe('/')
//   })

//   test('Create game form calls store', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/new')
//     const gameStore = useGameStore()
//     const spy = vi.spyOn(gameStore, 'create')

//     await wrapper.find('#username-input').setValue('player')
//     await wrapper.find('#player-count-input').setValue(2)
//     await wrapper.find('#confirm-game-btn').trigger('click')

//     await flushPromises()
//     expect(spy).toHaveBeenCalledExactlyOnceWith(2, 'player')
//   })
// })

// describe('Joining page', () => {
//   test('Display join page', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/join?code=AAAA')

//     expect(wrapper.find('#prompt-username').exists()).toBe(true)
//     expect(wrapper.find('#confirm-username').exists()).toBe(true)
//   })

//   test('Join page without query parameter redirect to /', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/join')

//     await flushPromises()
//     await delay()
//     expect(router.currentRoute.value.fullPath).toBe('/')
//   })

//   test('Called join on the store after choosing name', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/join?code=AAAA')
//     const gameStore = useGameStore()
//     const spy = vi.spyOn(gameStore, 'join')

//     await wrapper.find('#prompt-username').setValue('player 2')
//     await wrapper.find('#confirm-username').trigger('click')

//     expect(spy).toHaveBeenCalledExactlyOnceWith('AAAA', 'player 2')
//   })
// })

// describe('Lobby page', () => {
//   test('Lobby screen when lobby joined', async ({ router }) => {
//     const wrapper = mount(App)
//     const gameStore = useGameStore()
//     gameStore.lobby = {
//       id: 'AAAA',
//       players: ['player 1'],
//       capacity: 4,
//       you: 'player 1',
//     }
//     await router.push('/lobby')

//     await flushPromises()
//     expect(wrapper.find('#lobby-code-display').text()).toBe('AAAA')
//   })

//   test('Navigating to /lobby without a lobby and code should put route to home', async ({
//     router,
//   }) => {
//     const wrapper = mount(App)
//     await router.push('/lobby')

//     await flushPromises()
//     await delay()
//     expect(router.currentRoute.value.fullPath).toBe('/')
//   })

//   test('Navigating to lobby with code but no cookie should redirect to /join', async ({
//     router,
//   }) => {
//     const wrapper = mount(App)
//     await router.push('/lobby?code=AAAA')

//     await flushPromises()
//     await delay()
//     expect(router.currentRoute.value.fullPath).toBe('/join?code=AAAA')
//   })

//   test('Navigating to lobby with old code should ignore cookie', async ({ router }) => {
//     const wrapper = mount(App)
//     await router.push('/lobby?code=AAAA')
//     const gameStore = useGameStore()
//     gameStore.lobby = {
//       id: 'BBBB',
//       players: ['player 1'],
//       capacity: 4,
//       you: 'player 1',
//     }

//     expect(wrapper.find('#prompt-username').exists()).toBe(true)
//     expect(wrapper.find('#confirm-username').exists()).toBe(true)
//   })
// })
