<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const gameStore = useGameStore()
const route = useRoute()

const username = ref('')

function join() {
  gameStore.join(route.query.code as string, username.value)
}
</script>

<template>
  <input id="prompt-username" type="text" v-model="username" />
  <button id="confirm-username" @click="join">Join</button>
</template>
