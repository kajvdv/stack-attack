import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Game } from '@/types/game'
import type { LobbyCreate, LobbyResponse } from '@/types/lobby'
import { useApi } from '@/plugins/client'
import { useRouter } from 'vue-router'
import { useLobbyStore } from './lobby'

export const useGameStore = defineStore('game', () => {
  const router = useRouter()
  const lobbyStore = useLobbyStore()
  const game = ref<Game | null>(null)
  const api = useApi()
  let send: (msg: string) => Promise<void> = async (_msg: string) => {
    throw new Error('You should first call connect().')
  }

  async function connect() {
    send = await api.lobby.connect(async (receivedGame: object) => {
      if (!lobbyStore.lobby) {
        throw new Error('No lobby in store')
      }
      if (receivedGame.topcard) {
        game.value = receivedGame as Game
        const otherPlayers = Object.keys(game.value.otherPlayers)
        lobbyStore.fetchCurrentLobby()
      } else {
        console.log(receivedGame.error)
        game.value.message = receivedGame.error
      }
    })
  }

  // async function connect() {
  //   await _connect()
  //   return
  // }

  async function play(cardIndex: number) {
    await send(String(cardIndex))
  }

  async function draw() {
    await send('-1')
  }

  // async function create(size: number, creator: string) {
  //   const result = await api.lobby.createLobby({ creator, size })
  //   lobby.value = result
  // }

  // async function join(code: string, username: string) {
  //   const result = await api.lobby.join(code, username)
  //   lobby.value = result
  // }

  // async function fetchCurrentSession() {
  //   const result = await api.lobby.getCurrentLobby()
  //   lobby.value = result
  // }

  // const session = computed(() => api.lobby.getCurrentSession())
  const canDraw = computed(() => game.value?.can_draw ?? false)
  const topcard = computed(() => game.value?.topcard ?? {})
  const currentPlayer = computed(() => game.value?.current_player ?? '')
  const message = computed(() => game.value?.message ?? '')

  return {
    // create,
    // join,
    // fetchCurrentSession,
    connect,
    play,
    draw,
    game,
    topcard,
    canDraw,
    currentPlayer,
    message,
    // code,
    // session,
  }
})
