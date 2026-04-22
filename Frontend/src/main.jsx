import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OwnerAuthProvider } from './context/OwnerAuthContext.jsx'
import { BikeOwnerAuthProvider } from './context/BikeOwnerAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Hotel owners and Bike rental owners are entirely separate auth contexts */}
    <OwnerAuthProvider>
      <BikeOwnerAuthProvider>
        <App />
      </BikeOwnerAuthProvider>
    </OwnerAuthProvider>
  </StrictMode>,
)
