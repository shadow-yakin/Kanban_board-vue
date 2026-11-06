import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initTheme } from '@/composables/useTheme'
import '@/styles/theme.css'
import App from './App.vue'
import { useBoardPersistence } from '@/composables/useBoardPersistence'

const app = createApp(App)
app.use(createPinia())

useBoardPersistence()
initTheme()
app.mount('#app')