import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { RequestForm } from './pages/RequestForm'
import { Tracker } from './pages/Tracker'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
