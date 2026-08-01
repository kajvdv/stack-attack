import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { LobbyCreate, LobbyResponse } from '@/types/lobby'
import { useApi } from '@/plugins/client'
import { useRouter } from 'vue-router'

export const useLobbyStore = defineStore('lobby', () => {
  const lobby = ref<LobbyResponse | null>(null)
  const api = useApi()
  const router = useRouter()

  async function fetchCurrentLobby() {
    const data = await api.lobby.getCurrentLobby()
    lobby.value = data
    if (data.players.length == data.capacity) {
      console.log('pushing board')
      router.push('/board')
    }
  }

  async function createLobby(config: LobbyCreate) {
    const response: LobbyResponse = await api.lobby.createLobby(config)
    lobby.value = response
  }

  async function joinLobby(code: string, username: string) {
    const result = await api.lobby.join(code, username)
    lobby.value = result
  }

  async function fetchCurrentSession() {
    const result = await api.lobby.getCurrentLobby()
    lobby.value = result
  }

  const players = computed<string[]>(() => lobby.value?.players ?? [])
  const you = computed<string>(() => lobby.value?.you ?? '')
  const code = computed<string>(() => lobby.value?.id ?? '')
  const capacity = computed(() => lobby.value?.capacity ?? 0)
  return {
    players,
    you,
    code,
    fetchCurrentSession,
    createLobby,
    joinLobby,
    capacity,
    lobby,
    fetchCurrentLobby,
  }
})
