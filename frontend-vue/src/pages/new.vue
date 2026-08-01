<script setup lang="ts">
import { Button } from '@/components/buttons'
import { Card } from '@/components/card'
import { NewGameCard } from '@/components/menu'
import { useGameStore } from '@/stores/game'
import { useLobbyStore } from '@/stores/lobby'
import { ref } from 'vue'

// const gameStore = useGameStore()
const lobbyStore = useLobbyStore()

const username = ref('')
const size = ref(4)

// async function createLobby() {
//   await lobbyStore.createLobby({ size: size.value, creator: username.value })
// }
</script>

<template>
  <NewGameCard></NewGameCard>
</template>
