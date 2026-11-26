import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/variables.css'
import './styles/global.css'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV) {
  console.log('PWA service worker disabled in dev mode')
} else {
  registerSW({
    onNeedRefresh() {
      console.log('New content available, please refresh')
    },
    onOfflineReady() {
      console.log('App is ready for offline use')
    },
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
