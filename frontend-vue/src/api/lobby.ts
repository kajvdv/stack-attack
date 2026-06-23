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

export async function join(username: string, lobbyCode: string) {
  const response = await fetch(`/api/lobbies/${lobbyCode}/join`, {
    method: 'post',
    body: JSON.stringify({ username }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await response.json()
}

export function getSessionToken(): string | null {
  const cookie = document.cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith('sessionToken'))
  if (cookie) {
    return cookie.split('=')[1] ?? null
  } else {
    return null
  }
}

export async function connect(
  onReceive: (game: object) => Promise<void>,
): Promise<(msg: string) => Promise<void>> {
  const response = await fetch('/api/lobbies/current')
  const { ws_url } = await response.json()
  const ws = new WebSocket(ws_url)

  ws.onmessage = (ev: MessageEvent) => {
    onReceive(JSON.parse(ev.data))
  }

  return async (msg: string) => {
    ws.send(msg)
  }
}

export async function getJoinedGame() {}
