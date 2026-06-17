import createLobbyResponse from '@/../data/lobby_response.json'
import sessionToken from '@/../data/player-RRXJ.txt?raw'
import type { Api } from '@/types/api'

let session = true
let token = ''
export function setToken(value: '') {
  token = value
}

const api: Api = {
  lobby: {
    async createLobby() {
      return createLobbyResponse
    },
    async getLobby(code: string) {
      return { ...createLobbyResponse, id: code }
    },
    async join(username: string, lobbyCode: string) {
      token = sessionToken
    },
    getSessionToken() {
      if (session && token !== '') {
        return token
      } else {
        return null
      }
    },
  },
}

export const lobby = api.lobby

export default api
