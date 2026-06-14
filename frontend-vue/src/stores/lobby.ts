import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LobbyCreate, LobbyResponse } from '@/types/lobby'
import { useApi } from '@/plugins/client'

export const useLobbyStore = defineStore('lobby', () => {
  const lobby = ref<LobbyResponse | null>(null)
  const api = useApi()
  async function create(config: LobbyCreate) {
    const response: LobbyResponse = await api.lobby.createLobby(config)
    lobby.value = response
  }

  async function getLobby(code: string) {
    const response: LobbyResponse = await api.lobby.getLobby(code)
    lobby.value = response
  }

  const players = computed<string[]>(() => lobby.value?.players ?? [])
  const code = computed<string>(() => lobby.value?.id ?? '')
  return { players, code, create, getLobby }
})
