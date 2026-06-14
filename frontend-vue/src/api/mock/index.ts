import createLobbyResponse from '@/../data/lobby_response.json'
import type { Api } from '@/types/api'

const api: Api = {
  lobby: {
    async createLobby() {
      return createLobbyResponse
    },
    async getLobby(code: string) {
      return { ...createLobbyResponse, id: code }
    },
  },
}

export default api
