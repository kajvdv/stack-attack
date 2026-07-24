<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const gameStore = useGameStore()
const route = useRoute()
const router = useRouter()

const username = ref('')

async function join() {
  await gameStore.join(route.query.code as string, username.value)
  await router.push(`/lobby`)
}
</script>

<template>
  <input id="prompt-username" type="text" v-model="username" />
  <button id="confirm-username" @click="join">Join</button>
</template>
