<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { PlayingCard } from '.'
import type { Card } from '@/types/board'

const { cards } = defineProps<{
  cards: Card[]
}>()

const gameStore = useGameStore()
</script>

<template>
  <div class="flex flex-row justify-center max-w-fit m-auto">
    <PlayingCard
      @click="gameStore.play(index)"
      class="relative hover:-top-10 transistion-[top]"
      v-for="(card, index) in cards"
      v-bind="card"
      :class="{ '-ml-30': index !== 0 }"
    />
  </div>
</template>
