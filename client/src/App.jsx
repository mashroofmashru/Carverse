import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Details from './pages/Details'
import InventoryPage from './pages/Inventory'
import ContactPage from './pages/Contact'
import DealerDashboard from './pages/Dealer/DealerDashBoard'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import VehicleDetails from './pages/Details'
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
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/> 
        <Route path="/details/:id" element={<VehicleDetails />} />
      </Routes>
    </>
  )
}

export default App
