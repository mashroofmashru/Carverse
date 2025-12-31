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
import AdminDashBoard from './pages/admin/AdminDashBoard'
import ManageUser from './pages/admin/ManageUsers'
import AdminInventory from './pages/admin/AdminInventory'
import DealerInventory from './pages/Dealer/DealerInventory'
import AdminSettings from './pages/admin/AdminSettings'
import DealerEnquiries from './pages/Dealer/DealerEnquiries'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* UserRouters */}
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details/>} />
        <Route path="/viewInventory" element={<InventoryPage/>} />
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/> 
        <Route path="/details/:id" element={<VehicleDetails />} />

        {/* Dealer routers */}
        <Route path='/dealer' element={<DealerDashboard/>}/>
        <Route path='/dealer/cars' element={<DealerInventory/>}/>
        <Route path='/dealer/enquiries' element={<DealerEnquiries/>}/>

        {/* admin routers */}
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/admin/users" element={<ManageUser />} />
        <Route path="/admin/cars" element={<AdminInventory />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </>
  )
}

export default App
