import { ThemeProvider } from '@diatonic/ui'
import React from 'react'
import ReactDOM from 'react-dom/client'


import App from './App'
import '@diatonic/ui/styles'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
