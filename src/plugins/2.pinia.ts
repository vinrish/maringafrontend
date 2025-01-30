import { createPinia } from 'pinia'
import type { App } from 'vue'
import piniaPersistedState from 'pinia-plugin-persistedstate'

export const store = createPinia()

store.use(piniaPersistedState)

export default function (app: App) {
  app.use(store)
}
