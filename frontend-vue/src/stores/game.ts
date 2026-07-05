import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Game } from '@/types/game'
import type { LobbyCreate, LobbyResponse } from '@/types/lobby'
import { useApi } from '@/plugins/client'
import { useRouter } from 'vue-router'

export const useGameStore = defineStore('game', () => {
  const router = useRouter()
  const game = ref<Game | null>(null)
  const lobby = ref<LobbyResponse | null>(null)
  const api = useApi()
  let send: (msg: string) => Promise<void> = async (_msg: string) => {
    throw new Error('You should first call connect().')
  }

  function _connect() {
    api.lobby
      .connect(async (receivedGame: object) => {
        game.value = receivedGame as Game
        const otherPlayers = Object.keys(game.value.otherPlayers)
        console.log(otherPlayers)
        console.log(lobby.value?.players)
        if (!otherPlayers.every((player) => lobby.value?.players.includes(player))) {
          await fetchCurrentSession()
        }
      })
      .then((value) => (send = value))
  }

  function connect() {
    if (lobby.value) {
      _connect()
    } else {
      throw new Error('First call /lobbies/join with a username.')
    }

    return
  }

  async function play(cardIndex: number) {
    await send(String(cardIndex))
  }

  async function draw() {
    await send('-1')
  }

  async function create(size: number, creator: string) {
    const result = await api.lobby.createLobby({ creator, size })
    lobby.value = result
    await router.push('/lobby')
  }

  async function join(code?: string, username?: string) {
    const result = await api.lobby.join(code, username)
    lobby.value = result
    await router.push(`/lobby`)
  }

  async function fetchCurrentSession() {
    const result = await api.lobby.getCurrentLobby()
    lobby.value = result
  }

  const players = computed(() => lobby.value?.players ?? [])
  const code = computed(() => lobby.value?.id ?? '')
  const you = computed(() => lobby.value?.you ?? '')
  const capacity = computed(() => lobby.value?.capacity ?? 0)
  const session = computed(() => api.lobby.getCurrentSession())

  watch(players, async () => {
    if (lobby.value && lobby.value.players.length === lobby.value.capacity) {
      await router.replace('/board')
    }
  })

  return {
    connect,
    create,
    join,
    play,
    draw,
    fetchCurrentSession,
    game,
    lobby,
    players,
    code,
    you,
    capacity,
    session,
  }
})
