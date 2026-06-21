<script setup lang="ts">
import { Card } from '@/components/card'
</script>

<template>
  <div class="grid grid-cols-3 gap-6 w-full h-screen bg-felt border border-felt-line p-6">
    <div class="col-span-3 rounded-2xl p-5 text-white flex">
        <div class="flex flex-row justify-center max-w-fit m-auto">
          <img class="h-50 w-40 object-scale-down" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
          <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
      </div>
    </div>
    <div class=" grid grid-cols-1 col-start-2">
      <!-- Het middenstuk -->
      <div class="flex justify-between items-center border-2 border-felt-line border-dashed rounded-2xl bg-felt-light p-6">
        <img class="h-50 w-40 object-scale-down" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down" src="/src/assets/cards/back.png"></img>
      </div>
    </div>
    <!-- De eigen hand -->
    <div class="col-span-3 rounded-2xl p-5 text-white flex">
      <div class="flex flex-row justify-center max-w-fit m-auto">
        <img class="h-50 w-40 object-scale-down" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
        <img class="h-50 w-40 object-scale-down -ml-30" src="/src/assets/cards/back.png"></img>
      </div>
    </div>
  </div>
</template>
