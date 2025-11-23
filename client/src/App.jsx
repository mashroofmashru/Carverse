// src/App.jsx
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Details from './pages/Details'
import InventoryPage from './pages/Inventory'
import ContactPage from './pages/Contact'
import DealerDashboard from './pages/DealerDashBoard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details/>} />
        <Route path="/viewInventory" element={<InventoryPage/>} />
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path='/dealer' element={<DealerDashboard/>}/>
      </Routes>
    </>
  )
}

export default App
