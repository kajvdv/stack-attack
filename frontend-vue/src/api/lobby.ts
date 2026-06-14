import type { LobbyCreate } from '@/types/lobby'

export async function createLobby({ creator, size }: LobbyCreate) {
  const response = await fetch('/api/lobbies', {
    method: 'post',
    body: JSON.stringify({ creator, size }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await response.json()
}

export async function getLobby(code: string) {
  const response = await fetch(`/api/lobbies/${code}`)
  return await response.json()
}

export function getSessionToken(): string | null {
  console.log(document.cookie.split(';'))
  return ''
}
