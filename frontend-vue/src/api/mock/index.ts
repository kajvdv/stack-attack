import createLobbyResponse from '@/../data/lobby_response.json'
import sessionToken from '@/../data/player-RRXJ.txt?raw'
import type { Api } from '@/types/api'

let session = true
export function setSession(value: boolean) {
  session = value
}

const api: Api = {
  lobby: {
    async createLobby() {
      return createLobbyResponse
    },
    async getLobby(code: string) {
      return { ...createLobbyResponse, id: code }
    },
    getSessionToken() {
      if (session) {
        return sessionToken
      } else {
        return null
      }
    },
  },
}

export default api
