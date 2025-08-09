import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppComponent } from '@shared/pages/App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </StrictMode>
)
