<script setup lang="ts">
import { Button } from '@/components/buttons'
import { Card } from '@/components/card'
import { NewGameCard } from '@/components/menu'
import { useGameStore } from '@/stores/game'
import { ref } from 'vue'

const gameStore = useGameStore()

const username = ref('')
const size = ref(4)

async function createLobby() {
  await gameStore.create(size.value, username.value)
}
</script>

<template>
  <NewGameCard></NewGameCard>
</template>
