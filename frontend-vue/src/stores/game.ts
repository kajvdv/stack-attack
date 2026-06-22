import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Game } from '@/types/game'
import { useApi } from '@/plugins/client'

export const useGameStore = defineStore('game', () => {
  const game = ref<Game | null>(null)
  const api = useApi()
  let send: (msg: string) => void = (_msg: string) => {
    throw new Error('You should first call connect().')
  }
  async function connect() {
    send = await api.lobby.connect(async (receivedGame: object) => {
      game.value = receivedGame as Game
    })
  }

  return { game, connect, send }
})
