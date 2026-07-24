<script setup lang="ts">
import { Button } from '@/components/buttons'
import { Card } from '@/components/card'
import { useGameStore } from '@/stores/game'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

const username = ref('')
const size = ref(4)

async function createLobby() {
  await gameStore.create(size.value, username.value)
  await router.push('/lobby')
}
</script>

<template>
  <Card class="max-w-xs">
    <RouterLink v-slot="{ navigate, isActive }" to="/" custom>
      <div class="mb-5">
        <a
          id="back-home-link"
          @click="navigate"
          class="text-xs hover:underline cursor-pointer text-(--ink-dim) uppercase"
          >← Terug</a
        >
      </div>
    </RouterLink>
    <div class="font-title text-lg font-bold text-(--ink) mb-1">Lobby aanmaken</div>
    <div class="text-xs text-(--ink-mid) mb-5">Kies een naam en stel de regels in.</div>
    <form @submit.prevent="createLobby()">
      <div class="mb-4">
        <label class="block mb-1.5 text-xs text-(--ink-mid)" for="username"
          >Jouw naam in dit spel</label
        >
        <input
          id="username-input"
          v-model="username"
          class="w-full border box-border rounded-md py-2.5 px-3 text-sm text-(--ink) bg-(--cream) border-(--border) focus:border-(--border-focus) outline-0"
          name="username"
          type="text"
          placeholder="bijv. Sander"
          required
        />
        <div class="text-xs text-(--ink-dim) mt-1 italic">Zo zien andere jou in de lobby.</div>
      </div>
      <div>
        <label class="block mb-1.5 text-xs text-(--ink-mid)" for="playerCount"
          >Aantal spelers</label
        >
        <select
          id="player-count-input"
          v-model="size"
          name="playerCount"
          class="w-full border box-border rounded-md py-2.5 px-3 text-sm text-(--ink) bg-(--cream) border-(--border) focus:border-(--border-focus) outline-0"
        >
          <option :value="2">2 spelers</option>
          <option :value="3">3 spelers</option>
          <option :value="4">4 spelers</option>
          <option :value="5">5 spelers</option>
          <option :value="6">6 spelers</option>
        </select>
        <div class="text-xs text-(--ink-dim) mt-1 italic">2 – 6 spelers toegestaan.</div>
        <Button
          @click="createLobby()"
          type="submit"
          id="confirm-game-btn"
          variant="green"
          class="mt-4"
          >Maak lobby aan →</Button
        >
      </div>
    </form>
  </Card>
</template>
