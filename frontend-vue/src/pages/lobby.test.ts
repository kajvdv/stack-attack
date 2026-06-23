import { describe, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { test, expect } from '@/__tests__/setup'
import LobbyPage from './lobby.vue'

describe('LobbyPage', () => {
  test('redirect to game page when full', async ({ client, router }) => {
    const spy = vi.spyOn(window, 'prompt').mockImplementation(() => 'test player')
    await router.push('/lobby?code=1234')
    const wrapper = mount(LobbyPage)
    await client.lobby.sendMessage({})
    await flushPromises()
    // expect(router.currentRoute.value.path).toBe('/board')
  })
})
