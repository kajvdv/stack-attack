<script setup lang="ts">
import { Card, CardTitle } from '@/components/card'
import { Button } from '@/components/buttons'
import { TextInput } from '@/components/input/index.ts'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useApi } from '@/plugins/client'
import { HomeCard } from '@/components/menu'

const router = useRouter()
const code = ref('')

async function joinLobby() {
  if (code.value.length === 4) {
    await router.push(`/join?code=${code.value}`)
  }
}
</script>

<template>
  <HomeCard></HomeCard>
</template>
