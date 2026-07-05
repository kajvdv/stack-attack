import createLobbyResponse from '@/../data/lobby_response.json'
import sessionToken from '@/../data/player-RRXJ.txt?raw'
import joinMessage from '@/../data/join_message.json'
import type { Session } from '@/types/api'

let session = true
let token = ''
export function setToken(value: '') {
  token = value
}

export const lobby = {
  messageSpy(_msg: string) {
    console.log('calling message spy')
  },
  async sendMessage(game: object): Promise<void> {
    throw new Error('First call connect')
  },

  async createLobby() {
    return createLobbyResponse
  },
  async getLobby(code: string) {
    return { ...createLobbyResponse, id: code }
  },
  async join(_username?: string) {
    token = sessionToken
    return createLobbyResponse
  },
  getCurrentSession(): Session | null {
    return { username: 'player', lobby: 'TEST' }
  },
  async getCurrentLobby() {
    return createLobbyResponse
  },
  getSessionToken() {
    if (session && token !== '') {
      return token
    } else {
      return null
    }
  },
  async connect(onReceive: (game: object) => Promise<void>) {
    this.sendMessage = onReceive
    // onReceive(joinMessage) // backend calling its send method
    return async (msg: string) => {
      console.log('calling send')
      this.messageSpy(msg)
    }
  },
  async getJoinedGame() {},
}
