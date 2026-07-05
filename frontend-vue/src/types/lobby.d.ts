export interface LobbyCreate {
  size: number
  creator: string
}

export interface LobbyResponse {
  id: string
  players: string[]
  capacity: number
  you: string
}

export interface LobbyPlayer {
  name: string
}
