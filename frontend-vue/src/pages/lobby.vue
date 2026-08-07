<script setup lang="ts">
import { Card } from '@/components/card'
import { PlayerList } from '@/components/lobby'
import { useGameStore } from '@/stores/game'
import { useLobbyStore } from '@/stores/lobby'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const lobbyStore = useLobbyStore()
const gameStore = useGameStore()
gameStore.connect()

watch(
  () => lobbyStore.players,
  async () => {
    console.log('watch active')
    if (lobbyStore.players.length === lobbyStore.capacity) {
      await router.push('/board')
    }
  },
)

onMounted(async () => {
  if (lobbyStore.players.length === lobbyStore.capacity) {
    // setTimeout(async () => await router.push('/board'), 2000)
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
      :own="lobbyStore.you"
      :data="lobbyStore.players"
      :max-players="lobbyStore.capacity"
    ></PlayerList>
  </Card>
</template>
