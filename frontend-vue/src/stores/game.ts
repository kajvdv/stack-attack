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

  async function _connect() {
    const value = await api.lobby.connect(async (receivedGame: object) => {
      game.value = receivedGame as Game
      const otherPlayers = Object.keys(game.value.otherPlayers)
      console.log('New game received')
      console.log(otherPlayers)
      console.log(lobby.value?.players)
      if (!lobby.value || !otherPlayers.every((player) => lobby.value?.players.includes(player))) {
        console.log('Fetching current session')
        await fetchCurrentSession()
      }
    })
    send = value
  }

  async function connect() {
    if (lobby.value) {
      await _connect()
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
  }

  async function join(code: string, username: string) {
    const result = await api.lobby.join(code, username)
    lobby.value = result
  }

  async function fetchCurrentSession() {
    const result = await api.lobby.getCurrentLobby()
    lobby.value = result
  }

  const players = computed(() => lobby.value?.players ?? [])
  const you = computed(() => lobby.value?.you ?? '')
  const capacity = computed(() => lobby.value?.capacity ?? 0)
  const session = computed(() => api.lobby.getCurrentSession())
  const canDraw = computed(() => game.value?.can_draw ?? false)
  const topcard = computed(() => game.value?.topcard ?? {})
  const currentPlayer = computed(() => game.value?.current_player ?? '')
  const message = computed(() => game.value?.message ?? '')
  const lobbyCode = computed(() => lobby.value?.id ?? '')

  // watch(players, async () => {
  //   console.log('players changed', players.value)
  //   console.log(
  //     'lobby.value && players.value.length === lobby.value.capacity =',
  //     lobby.value && players.value.length === lobby.value.capacity,
  //   )
  //   if (lobby.value && players.value.length === lobby.value.capacity) {
  //     console.log('going to /board')
  //     await router.replace('/board')
  //   }
  // })

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
    topcard,
    canDraw,
    currentPlayer,
    message,
    // code,
    you,
    capacity,
    session,
    lobbyCode,
  }
})
