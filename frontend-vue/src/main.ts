import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/styles.css'

import App from './App.vue'
import router from './router'
import { createApi } from './plugins/client.ts'
import api from '@/api'
import mockApi, { setToken } from '@/api/mock'

const app = createApp(App)

app.use(createPinia())
if (import.meta.env.PROD) {
  app.use(createApi(api))
} else {
  setToken('')
  app.use(createApi(mockApi))
}
app.use(router)

app.mount('#app')
