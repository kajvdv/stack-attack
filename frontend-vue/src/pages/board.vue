<script setup lang="ts">
import { PlayingCard, Hand } from '@/components/board'
import { useGameStore } from '@/stores/game'
import { useLobbyStore } from '@/stores/lobby'
import type { Card } from '@/types/board'
import { computed } from 'vue'

const gameStore = useGameStore()
const lobbyStore = useLobbyStore()

gameStore.connect()

const otherCards = computed(() => {
  const otherCards = Object.entries(gameStore.game?.otherPlayers ?? []).map(
    ([playerName, cardCount]) => {
      return Array<Card>(cardCount).fill({ value: '', suit: '' })
    },
  )
  return otherCards
})

const playerIndex = computed(() => lobbyStore.players.indexOf(gameStore.currentPlayer))
</script>

<template>
  <div class="grid grid-cols-3 gap-6 w-full h-screen bg-felt border border-felt-line p-6">
    <!-- Het middenstuk -->
    <div
      class="flex justify-between items-center border-2 border-felt-line border-dashed rounded-2xl bg-felt-light p-6"
    >
      <PlayingCard id="draw-stack" @click="gameStore.draw" />
      <PlayingCard id="top-card" v-bind="gameStore.topcard" />
    </div>
    <div class="col-span-3 rounded-2xl p-5 text-white flex">
      <Hand :current="playerIndex == 0" id="own-hand" :cards="gameStore.game?.hand ?? []" />
    </div>
    <div class="col-span-3 rounded-2xl p-5 text-white flex">
      <Hand :current="playerIndex == 1" class="pointer-events-none" :cards="otherCards[0] ?? []" />
    </div>
    <div class="grid grid-cols-1 col-start-2"></div>
  </div>
  <div id="message-display">{{ gameStore.message }}</div>
</template>
