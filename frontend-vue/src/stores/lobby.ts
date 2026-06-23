import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { LobbyCreate, LobbyResponse } from '@/types/lobby'
import { useApi } from '@/plugins/client'
import { useGameStore } from './game'
import { useRouter } from 'vue-router'

export const useLobbyStore = defineStore('lobby', () => {
  const gameStore = useGameStore()
  const router = useRouter()
  const { otherPlayers } = storeToRefs(gameStore)
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

  async function joinLobby(username: string, lobbyCode: string) {
    await api.lobby.join(username, lobbyCode)
  }

  const currentSession = computed(() => {
    const token = api.lobby.getSessionToken()
    if (!token) {
      return { name: '', lobby: '' }
    }
    const parts = token.split('.')
    const { sub: name, lobby, exp } = JSON.parse(atob(parts.at(1) ?? ''))
    return { name, lobby }
  })

  const players = computed<string[]>(() => lobby.value?.players ?? [])
  const code = computed<string>(() => lobby.value?.id ?? '')
  const capacity = computed(() => lobby.value?.capacity ?? 0)
  watch(otherPlayers, async () => {
    await getLobby(lobby.value?.id ?? '')
    if (lobby.value?.capacity === lobby.value?.players.length) {
      await router.push('/board')
    }
  })
  return { players, code, currentSession, create, getLobby, joinLobby, capacity }
})
