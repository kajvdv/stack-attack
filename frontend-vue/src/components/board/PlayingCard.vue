<script setup lang="ts">
import type { Card } from '@/types/board';

const {suit = "", value = ""} = defineProps<Card>()

let src = "/cards/back.png"
if (suit && value) {
  src =  `/cards/${value}_of_${suit}.png`
}
</script>

<template>
  <img class="h-50 w-40 object-scale-down" :src="src"></img>
</template>
