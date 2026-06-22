import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/styles.css'

import App from './App.vue'
import router from './router'
import { createApi } from './plugins/client.ts'
import * as api from '@/api'

const app = createApp(App)

app.use(createPinia())
if (import.meta.env.PROD) {
  app.use(createApi(api))
} else {
  const mockApi = await import('@/api/mock')
  app.use(createApi(mockApi))
}
app.use(router)

app.mount('#app')
