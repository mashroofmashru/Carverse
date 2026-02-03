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
import AdminMessages from './pages/admin/AdminMessages'
import AdminInventory from './pages/admin/AdminInventory'

import AdminSoldInventory from './pages/admin/AdminSoldInventory'
import DealerInventory from './pages/Dealer/DealerInventory'
import DealerSoldInventory from './pages/Dealer/DealerSoldInventory'
import AdminSettings from './pages/admin/AdminSettings'
import DealerEnquiries from './pages/Dealer/DealerEnquiries'
import DealerSettings from './pages/Dealer/DealerSettings'
import ProtectedRoute from './pages/auth/ProtectedRoute'
import DealerApproval from './pages/auth/DealerApproval'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* UserRouters */}
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
        <Route path="/viewInventory" element={<InventoryPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/details/:id" element={<VehicleDetails />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'admin', 'dealer']}><ProfilePage /></ProtectedRoute>} />

        {/* Dealer routers */}
        <Route path='/dealer/approval' element={<DealerApproval />} />
        <Route element={<ProtectedRoute allowedRoles={['dealer']} />}>
          <Route path='/dealer' element={<DealerDashboard />} />
          <Route path='/dealer/cars' element={<DealerInventory />} />
          <Route path='/dealer/sold-cars' element={<DealerSoldInventory />} />
          <Route path='/dealer/enquiries' element={<DealerEnquiries />} />
          <Route path='/dealer/settings' element={<DealerSettings />} />
        </Route>

        {/* admin routers */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashBoard />} />
          <Route path="/admin/users" element={<ManageUser />} />
          <Route path="/admin/cars" element={<AdminInventory />} />
          <Route path="/admin/sold-cars" element={<AdminSoldInventory />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
