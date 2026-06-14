export interface LobbyCreate {
  size: number
  creator: string
}

export interface LobbyResponse {
  id: string
  players: string[]
}

export interface LobbyPlayer {
  name: string
}
