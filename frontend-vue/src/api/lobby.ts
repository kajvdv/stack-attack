import type { Session } from '@/types/api'
import type { Game } from '@/types/game'
import type { LobbyCreate, LobbyResponse } from '@/types/lobby'

export async function createLobby({ creator, size }: LobbyCreate): Promise<LobbyResponse> {
  const response = await fetch('/api/lobbies', {
    method: 'post',
    body: JSON.stringify({ creator, size }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await response.json()
}

export async function join(code?: string, username?: string): Promise<LobbyResponse> {
  const url = '/api/lobbies/join' + (code ? `?code=${code}` : '')
  const response = await fetch(url, {
    method: 'post',
    body: username ? JSON.stringify({ username }) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await response.json()
}

export async function getCurrentLobby(): Promise<LobbyResponse> {
  const response = await fetch('/api/lobbies/current', {
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

export function getCurrentSession(): Session | null {
  const token = getSessionToken()
  if (!token) return null
  const parts = token.split('.')
  const { sub: username, lobby, exp } = JSON.parse(atob(parts.at(1) ?? ''))
  return { username, lobby }
}

export async function connect(
  onReceive: (game: Game) => Promise<void>,
): Promise<(msg: string) => Promise<void>> {
  // const response = await fetch('/api/lobbies/current', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  // const { ws_url, url } = await response.json()
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // const code = url.split('/').at(-1) ?? ''

  const ws = new WebSocket(`${protocol}//${window.location.host}/api/lobbies/connect`)
  ws.onmessage = (ev: MessageEvent) => {
    onReceive(JSON.parse(ev.data))
  }

  return async (msg: string) => {
    ws.send(msg)
  }
}

export async function getJoinedGame() {}
