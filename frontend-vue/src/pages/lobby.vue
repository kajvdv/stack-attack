<script setup lang="ts">
import { LobbyCard } from '@/components/menu'
import { useGameStore } from '@/stores/game'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

console.log('setup watch')
watch(
  () => gameStore.players,
  async () => {
    console.log('watch active')
    if (gameStore.players.length === gameStore.capacity) {
      await router.push('/board')
    }
  },
)

onMounted(async () => {
  if (gameStore.players.length === gameStore.capacity) {
    setTimeout(async () => await router.push('/board'), 2000)
  }
})
</script>

<template>
  <LobbyCard></LobbyCard>
</template>
