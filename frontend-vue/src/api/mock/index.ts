import createLobbyResponse from '@/../data/lobby_response.json'
import sessionToken from '@/../data/player-RRXJ.txt?raw'
import joinMessage from '@/../data/join_message.json'

let session = true
let token = ''
export function setToken(value: '') {
  token = value
}

export const lobby = {
  messageSpy(_msg: string) {
    console.log('calling message spy')
  },

  async createLobby() {
    return createLobbyResponse
  },
  async getLobby(code: string) {
    return { ...createLobbyResponse, id: code }
  },
  async join(_username: string, _lobbyCode: string) {
    token = sessionToken
  },
  getSessionToken() {
    if (session && token !== '') {
      return token
    } else {
      return null
    }
  },
  async connect(onReceive: (game: object) => Promise<void>) {
    onReceive(joinMessage) // backend calling its send method
    return async (msg: string) => {
      this.messageSpy(msg)
    }
  },
}
