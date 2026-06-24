<script setup lang="ts">
import { Card } from '@/components/card'
import { PlayerList } from '@/components/lobby'
import { useGameStore } from '@/stores/game'
import { useLobbyStore } from '@/stores/lobby'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const lobbyStore = useLobbyStore()
const gameStore = useGameStore()
const { otherPlayers } = storeToRefs(gameStore)
if (lobbyStore.code === '' && route.query.code) {
  const code = route.query.code as string
  const session = lobbyStore.currentSession
  if (session.name == '' || session.lobby !== code) {
    let username = null
    while (!username) {
      username = window.prompt('Enter your name:')
    }
    lobbyStore.joinLobby(username, code)
  }
  lobbyStore.getLobby(code)
}
gameStore.connect()

watch(otherPlayers, async () => {
  await lobbyStore.getLobby(lobbyStore.code)
  if (lobbyStore.capacity === lobbyStore.players.length) {
    await router.push('/board')
  }
})
</script>

<template>
  <Card class="max-w-xs">
    <div class="flex justify-between items-center gap-8">
      <div
        id="lobby-code-display"
        class="font-title text-3xl font-black tracking-widest text-(--ink)"
      >
        {{ lobbyStore.code }}
      </div>
      <div
        class="flex-1 text-center max-w-20 tracking-widest text-xs rounded-lg border border-(--border) p-2"
      >
        📋
      </div>
    </div>
    <div class="text-xs text-(--ink-dim) uppercase mt-1">Lobby code — deel met vrienden</div>
    <div class="flex items-center gap-1.5 text-xs text-(--ink-dim) tracking-widest mb-3.5">
      <div class="w-1.5 h-1.5 bg-green-600 rounded-full shrink-0 animate-pulse"></div>
      Wachten op spelers…
    </div>
    <PlayerList
      :own="lobbyStore.currentSession.name"
      :data="lobbyStore.players"
      :max-players="lobbyStore.capacity"
    ></PlayerList>
    <div class="text-xs text-(--ink-dim) text-center tracking-widest italic pt-2.5 pb-1">
      Even gedult…<br />
      Het spel begint zodra de lobby vol is.
    </div>
  </Card>
</template>
