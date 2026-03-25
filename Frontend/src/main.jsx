import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OwnerAuthProvider } from './context/OwnerAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OwnerAuthProvider>
      <App />
    </OwnerAuthProvider>
  </StrictMode>,
)
