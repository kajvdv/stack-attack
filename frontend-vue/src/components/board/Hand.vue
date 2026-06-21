<script setup lang="ts">
import { PlayingCard } from '.'
import type { Card } from '@/types/board'

const { cards } = defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div class="flex flex-row justify-center max-w-fit m-auto">
    <PlayingCard v-for="(card, index) in cards" v-bind="card" :class="{ '-ml-30': index !== 0 }" />
  </div>
</template>
