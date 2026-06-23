<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { PlayingCard } from '.'

const gameStore = useGameStore()
</script>

<template>
  <PlayingCard @click="gameStore.draw()" />
</template>
