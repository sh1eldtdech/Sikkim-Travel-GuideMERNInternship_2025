import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/PageContainer/PageContainer.css'
import './pages/BikeRental/Dashboard/BikeRentalDashboard.css'
import App from './App.jsx'
import { OwnerAuthProvider } from './context/OwnerAuthContext.jsx'
import { BikeOwnerAuthProvider } from './context/BikeOwnerAuthContext.jsx'
import { GovAuthProvider } from './context/GovAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GovAuthProvider>
      <OwnerAuthProvider>
        <BikeOwnerAuthProvider>
          <App />
        </BikeOwnerAuthProvider>
      </OwnerAuthProvider>
    </GovAuthProvider>
  </StrictMode>,
)
