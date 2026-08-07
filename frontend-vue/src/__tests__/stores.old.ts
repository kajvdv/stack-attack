// import { describe, vi } from 'vitest'
// import { test, expect, delay } from './setup'
// import { flushPromises, mount } from '@vue/test-utils'
// import { useGameStore } from '@/stores/game'
// import * as api from '@/api'

// const Lobby = {
//   id: 'AAAA',
//   players: ['player 1'],
//   capacity: 2,
//   you: 'player 1',
// }

// const SESSION = {
//   username: 'player 1',
//   lobby: 'AAAA',
// }

// const GAME = {
//   topcard: {
//     suit: 'hearts',
//     value: '2',
//   },
//   previous_topcard: null,
//   can_draw: true,
//   choose_suit: false,
//   draw_count: 0,
//   current_player: 'player 1',
//   otherPlayers: {
//     'player 2': 2,
//   },
//   hand: [
//     {
//       suit: 'hearts',
//       value: '2',
//     },
//   ],
//   message: 'player 1 joined the game',
// }

// test('Redirect to /lobby after creating a new game', async ({ app, router }) => {
//   const spy = vi.spyOn(api.lobby, 'createLobby').mockResolvedValue(Lobby)
//   const gameStore = useGameStore()
//   gameStore.create(2, 'player 1')

//   await flushPromises()
//   await delay()
//   expect(gameStore.lobby).toStrictEqual(Lobby)
//   expect(spy).toHaveBeenCalled()
//   expect(router.currentRoute.value.fullPath).toBe('/lobby')
// })

// test('Join should get lobby and push to /lobby', async ({ app, router }) => {
//   const spy = vi.spyOn(api.lobby, 'join').mockResolvedValue(Lobby)
//   const gameStore = useGameStore()
//   gameStore.join('AAAA', 'player 2')

//   await flushPromises()
//   await delay()
//   expect(gameStore.lobby).toStrictEqual(Lobby)
//   expect(spy).toHaveBeenCalled()
//   expect(router.currentRoute.value.fullPath).toBe('/lobby')
// })

// test('Redirect to /board when lobby is full and counter is 0', async ({ app, router }) => {
//   const gameStore = useGameStore()
//   gameStore.lobby = { ...Lobby, players: ['player 1', 'player 2'] }
//   await router.push('/lobby')

//   await flushPromises()
//   await delay()
//   expect(router.currentRoute.value.fullPath).toBe('/board')
// })

// test('Connecting to game with lobby', async ({ app }) => {
//   const gameStore = useGameStore()
//   gameStore.lobby = Lobby
//   async function connect(onReceive: (game: object) => Promise<void>) {
//     onReceive(GAME)
//     return async () => {}
//   }
//   const spy = vi.spyOn(api.lobby, 'connect').mockImplementation(connect)
//   gameStore.connect()

//   await flushPromises()
//   expect(spy).toHaveBeenCalledOnce()
//   expect(gameStore.game).toStrictEqual(GAME)
// })

// test('GameStore sending messages ', async ({ app }) => {
//   const gameStore = useGameStore()
//   gameStore.lobby = Lobby
//   const spy = vi.fn<(msg: string) => Promise<void>>()
//   async function connect(onReceive: (game: object) => Promise<void>) {
//     onReceive(GAME)
//     return spy
//   }
//   vi.spyOn(api.lobby, 'connect').mockImplementation(connect)
//   gameStore.connect()
//   await flushPromises()
//   gameStore.play(0)
//   await flushPromises()
//   expect(spy).toHaveBeenCalledExactlyOnceWith('0')
// })

// test('GameStore should get the session from the client', ({ app }) => {
//   const spy = vi.spyOn(api.lobby, 'getCurrentSession').mockReturnValue(SESSION)
//   const gameStore = useGameStore()
//   expect(gameStore.session).toStrictEqual(SESSION)
// })

// test('Lobby of current session will be fetched if not in store', async ({ app, router }) => {
//   vi.spyOn(api.lobby, 'getCurrentSession').mockReturnValue(SESSION)
//   vi.spyOn(api.lobby, 'getCurrentLobby').mockResolvedValue(Lobby)
//   const gameStore = useGameStore()
//   await router.push('/lobby')

//   await flushPromises()
//   await delay()
//   expect(gameStore.lobby).toStrictEqual(Lobby)
// })

// test('Dont refetch when no players changed in message', async ({ app }) => {
//   const spy = vi.spyOn(api.lobby, 'getCurrentLobby').mockResolvedValue(Lobby)
//   async function connect(onReceive: (game: object) => Promise<void>) {
//     onReceive({
//       ...GAME,
//       otherPlayers: {
//         'player 2': 2,
//       },
//     })
//     return async () => {}
//   }
//   vi.spyOn(api.lobby, 'connect').mockImplementation(connect)
//   const gameStore = useGameStore()
//   gameStore.lobby = { ...Lobby, players: ['player 1', 'player 2'] }
//   gameStore.connect()
//   expect(spy).not.toHaveBeenCalled()
// })

// test('Refetch lobby when players game message is different then current lobby', async ({ app }) => {
//   const spy = vi.spyOn(api.lobby, 'getCurrentLobby').mockResolvedValue(Lobby)
//   async function connect(onReceive: (game: object) => Promise<void>) {
//     onReceive({
//       ...GAME,
//       otherPlayers: {
//         'player 2': 2,
//         'player 3': 2,
//       },
//     })
//     return async () => {}
//   }
//   vi.spyOn(api.lobby, 'connect').mockImplementation(connect)
//   const gameStore = useGameStore()
//   gameStore.lobby = { ...Lobby, players: ['player 1', 'player 2'] }
//   gameStore.connect()

//   await flushPromises()
//   expect(spy).toHaveBeenCalled()
// })
