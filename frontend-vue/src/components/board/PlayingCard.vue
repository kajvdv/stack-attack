<script setup lang="ts">
import type { Card } from '@/types/board';
import { computed } from 'vue';

const {suit = "", value = ""} = defineProps<Card>()

  const src = computed(() => {
    let imageSrc = "/cards/back.png"
    if (suit && value) {
      imageSrc =  `/cards/${value}_of_${suit}.png`
    }
    return imageSrc
})
</script>

<template>
  <img class="h-50 w-40 object-scale-down" :src="src" data-testid="card"></img>
</template>
