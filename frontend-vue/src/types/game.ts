import type { Card } from './board'

export interface Game {
  topcard: Card
  can_draw: boolean
  hand: Card[]
  current_player: string
  otherPlayers: Record<string, number>
  message: string
}
