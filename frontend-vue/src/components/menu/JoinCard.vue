<script setup lang="ts">
import { useLobbyStore } from '@/stores/lobby'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const lobbyStore = useLobbyStore()
const route = useRoute()
const router = useRouter()

const username = ref('')

async function join() {
  await lobbyStore.joinLobby(route.query.code as string, username.value)
  await router.push(`/lobby`)
}
</script>

<template>
  <input id="prompt-username" type="text" v-model="username" />
  <button id="confirm-username" @click="join">Join</button>
</template>
