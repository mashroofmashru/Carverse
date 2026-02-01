import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import './App.css'

import Home from './pages/Home'
import Details from './pages/Details'
import InventoryPage from './pages/Inventory'
import AboutUsPage from './pages/AboutUsPage'
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
import ProtectedRoute from './pages/auth/ProtectedRoute'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* UserRouters */}
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details/>} />
        <Route path="/viewInventory" element={<InventoryPage/>} />
        <Route path="/about-us" element={<AboutUsPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/> 
        <Route path="/details/:id" element={<VehicleDetails />} />


        {/* Dealer routers */}
        <Route element={<ProtectedRoute allowedRoles={['dealer']} />}>
          <Route path='/dealer' element={<DealerDashboard />} />
          <Route path='/dealer/cars' element={<DealerInventory />} />
          <Route path='/dealer/enquiries' element={<DealerEnquiries />} />
        </Route>

        {/* admin routers */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashBoard />} />
          <Route path="/admin/users" element={<ManageUser />} />
          <Route path="/admin/cars" element={<AdminInventory />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
