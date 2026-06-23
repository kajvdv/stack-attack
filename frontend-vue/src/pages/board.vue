<script setup lang="ts">
import { PlayingCard, Hand } from '@/components/board'
import { useGameStore } from '@/stores/game'
import type { Card } from '@/types/board'

const gameStore = useGameStore()

const cards: Card[] = [
  { value: 'king', suit: 'spades' },
  { value: 'king', suit: 'spades' },
  { value: 'king', suit: 'spades' },
  { value: 'king', suit: 'spades' },
  { value: 'king', suit: 'spades' },
  { value: 'queen', suit: 'spades' },
]
const topCard = { value: 'queen', suit: 'hearts' }
gameStore.connect()
</script>

<template>
  <div class="grid grid-cols-3 gap-6 w-full h-screen bg-felt border border-felt-line p-6">
    <div class="col-span-3 rounded-2xl p-5 text-white flex">
      <Hand class="pointer-events-none" :cards="cards" />
    </div>
    <div class="grid grid-cols-1 col-start-2">
      <!-- Het middenstuk -->
      <div
        class="flex justify-between items-center border-2 border-felt-line border-dashed rounded-2xl bg-felt-light p-6"
      >
        <PlayingCard />
        <PlayingCard v-bind="topCard" />
      </div>
    </div>
    <!-- De eigen hand -->
    <div class="col-span-3 rounded-2xl p-5 text-white flex">
      <Hand :cards="cards" />
    </div>
  </div>
</template>
