<script setup lang="ts">
import { LobbyCard } from '@/components/menu'
import { useGameStore } from '@/stores/game'
import { useLobbyStore } from '@/stores/lobby'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// const gameStore = useGameStore()
const lobbyStore = useLobbyStore()
const router = useRouter()

console.log('setup watch')
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
    setTimeout(async () => await router.push('/board'), 2000)
  }
})
</script>

<template>
  <LobbyCard></LobbyCard>
</template>
