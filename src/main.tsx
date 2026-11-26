import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Регистрация service worker для PWA
registerSW({
  onNeedRefresh() {
    // Можно добавить UI для обновления
    console.log('New content available, please refresh')
  },
  onOfflineReady() {
    console.log('App is ready for offline use')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
