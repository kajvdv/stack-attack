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
    send = await api.lobby.connect(async (receivedGame: Game) => {
      if (receivedGame.error) {
        if (game.value) {
          game.value.message = receivedGame.error
        }
        return
      }
      if (!lobbyStore.lobby) {
        throw new Error('No lobby in store')
      }
      if (receivedGame.message.includes('has won the game!')) {
        await router.push('/')
        return
      }
      game.value = receivedGame as Game
      const otherPlayers = Object.keys(game.value.otherPlayers)
      lobbyStore.fetchCurrentLobby()
    })
  }

  async function play(cardIndex: number) {
    await send(String(cardIndex))
  }

  async function draw() {
    await send('-1')
  }

  const canDraw = computed(() => game.value?.can_draw ?? false)
  const topcard = computed(() => game.value?.topcard ?? {})
  const currentPlayer = computed(() => game.value?.current_player ?? '')
  const message = computed(() => game.value?.message ?? '')

  return {
    connect,
    play,
    draw,
    game,
    topcard,
    canDraw,
    currentPlayer,
    message,
  }
})
