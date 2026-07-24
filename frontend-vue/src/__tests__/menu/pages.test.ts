import { flushPromises, mount } from '@vue/test-utils'
import { test, expect } from '../setup'
import { useGameStore } from '@/stores/game'
import { HomeCard, NewGameCard, JoinCard, LobbyCard } from '@/components/menu'
import App from '@/App.vue'

test('/home displays home screen', async ({ router }) => {
  const wrapper = mount(App)
  await router.push('/')

  expect(wrapper.findComponent(HomeCard).exists()).toBe(true)
  expect(wrapper.findComponent(NewGameCard).exists()).toBe(false)
  expect(wrapper.findComponent(JoinCard).exists()).toBe(false)
  expect(wrapper.findComponent(LobbyCard).exists()).toBe(false)
})

test('/new displays new game screen', async ({ router }) => {
  const wrapper = mount(App)
  await router.push('/new')

  expect(wrapper.findComponent(NewGameCard).exists()).toBe(true)
  expect(wrapper.findComponent(HomeCard).exists()).toBe(false)
  expect(wrapper.findComponent(JoinCard).exists()).toBe(false)
  expect(wrapper.findComponent(LobbyCard).exists()).toBe(false)
})

test('/join displays joining game screen', async ({ router }) => {
  const wrapper = mount(App)
  await router.push('/join?code=AAAA')

  expect(wrapper.findComponent(JoinCard).exists()).toBe(true)
  expect(wrapper.findComponent(NewGameCard).exists()).toBe(false)
  expect(wrapper.findComponent(HomeCard).exists()).toBe(false)
  expect(wrapper.findComponent(LobbyCard).exists()).toBe(false)
})

test('/lobby displays lobby screen', async ({ router }) => {
  const wrapper = mount(App)
  const gameStore = useGameStore()
  gameStore.lobby = {
    id: 'AAAA',
    players: ['player 1'],
    capacity: 4,
    you: 'player 1',
  }
  await router.push('/lobby')

  await flushPromises()
  expect(wrapper.findComponent(LobbyCard).exists()).toBe(true)
  expect(wrapper.findComponent(JoinCard).exists()).toBe(false)
  expect(wrapper.findComponent(NewGameCard).exists()).toBe(false)
  expect(wrapper.findComponent(HomeCard).exists()).toBe(false)
})
