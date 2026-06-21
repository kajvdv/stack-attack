<script setup lang="ts">
import type { Card } from '@/types/board';

const {suit = "", value = ""} = defineProps<Card>()

let src = "/src/assets/cards/back.png"
if (suit && value) {
  src =  `/src/assets/cards/${value}_of_${suit}.png`
}
</script>

<template>
  <img class="h-50 w-40 object-scale-down" :src="src"></img>
</template>
