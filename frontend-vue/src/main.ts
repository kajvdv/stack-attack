import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/styles.css'

import App from './App.vue'
import router, { initRouter } from './router'
import { createApi } from './plugins/client.ts'
import * as api from '@/api'

const app = createApp(App)

if (import.meta.env.PROD) {
  app.use(createApi(api))
} else {
  const mockApi = await import('@/api/mock')
  app.use(createApi(mockApi))
}
app.use(createPinia())
initRouter(router)
app.use(router)

app.mount('#app')
