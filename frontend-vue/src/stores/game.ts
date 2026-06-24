import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Game } from '@/types/game'
import { useApi } from '@/plugins/client'

export const useGameStore = defineStore('game', () => {
  const game = ref<Game | null>(null)
  const api = useApi()
  let send: (msg: string) => Promise<void> = async (_msg: string) => {
    throw new Error('You should first call connect().')
  }
  async function connect() {
    if (api.lobby.getSessionToken()) {
      send = await api.lobby.connect(async (receivedGame: object) => {
        game.value = receivedGame as Game
      })
    }
  }

  async function play(cardIndex: number) {
    await send(String(cardIndex))
  }

  async function draw() {
    await send('-1')
  }

  const otherPlayers = computed(() => game.value?.otherPlayers ?? {})
  const topcard = computed(() => game.value?.topcard ?? null)
  return { connect, play, draw, otherPlayers, topcard }
})
