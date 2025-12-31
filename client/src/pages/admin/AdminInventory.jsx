import React, { useState, useEffect } from "react";
import { 
  Car, Search, Eye, Trash2, 
  Fuel, Settings2, Gauge, Palette, X,
  AlertCircle, CheckCircle2 // Added for alerts
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import DetailBox from "../../components/Dashboard/DetailBox";
import api from "../../config/server";
import { ADMIN_LINKS } from "../../constants/Links";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCar, setSelectedCar] = useState(null);

  // --- Alert & Notification States ---
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/admin/get-inventory");
      setInventory(res.data.cars);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- TOAST NOTIFICATION HELPER ---
  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  // --- OPERATION: CONFIRMED DELETE ---
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/admin/delete-car/${deleteConfirm.id}`);
      setInventory(inventory.filter(car => car._id !== deleteConfirm.id));
      showToast("Vehicle deleted successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.message ||"Failed to delete vehicle", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, title: "" });
    }
  };

  // Filter Logic
  const filteredCars = (Array.isArray(inventory) ? inventory : []).filter((car) => {
    const matchesSearch = 
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || car.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-inter text-gray-900">
      <Header title="Admin Control Center" />
      
      <div className="flex flex-1">
        <SideBar links={ADMIN_LINKS}/>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-8">Master Inventory</h1>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search brand or model..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-semibold outline-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="SUVs">SUVs</option>
                <option value="SEDAN">SEDAN</option>
                <option value="HATCHBACK">HATCHBACK</option>
                <option value="ELECTRIC">ELECTRIC</option>
              </select>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Vehicle Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Specs</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Pricing</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                     <tr><td colSpan="5" className="text-center py-20 text-gray-400 animate-pulse">Loading Inventory...</td></tr>
                  ) : filteredCars.map((car) => (
                    <tr key={car._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={`http://localhost:3000${car.images?.[0]}`} 
                            className="w-20 h-14 object-cover rounded-lg" 
                            alt={car.title} 
                          />
                          <div>
                            <div className="font-bold text-gray-900">{car.brand} {car.model}</div>
                            <div className="text-[11px] text-gray-500">{car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1"><Fuel size={12}/> {car.fuelType}</div>
                        <div className="flex items-center gap-1 mt-1"><Settings2 size={12}/> {car.transmission}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">
                        ₹{car.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${car.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedCar(car)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Eye size={18} /></button>
                          {/* UPDATED DELETE BUTTON */}
                          <button 
                            onClick={() => setDeleteConfirm({ show: true, id: car._id, title: `${car.brand} ${car.model}` })}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- CUSTOM ALERT BOX (DELETE CONFIRMATION) --- */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Remove Vehicle?</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                You are about to delete <span className="font-bold text-gray-800">{deleteConfirm.title}</span>. This data will be permanently removed from the server.
              </p>
              <div className="flex gap-3 w-full mt-8">
                <button 
                  onClick={() => setDeleteConfirm({ show: false, id: null, title: "" })}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION TOAST --- */}
      {notification.show && (
        <div className={`fixed bottom-8 right-8 z-[70] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}

      {/* --- EYE (VIEW MODAL) --- */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{selectedCar.brand} {selectedCar.model}</h2>
              <button onClick={() => setSelectedCar(null)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            <div className="p-6">
              <img src={`http://localhost:3000${selectedCar.images?.[0]}`} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md" alt="Car" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <DetailBox label="Year" value={selectedCar.year} />
                <DetailBox label="Fuel" value={selectedCar.fuelType} />
                <DetailBox label="Transmission" value={selectedCar.transmission} />
                <DetailBox label="Mileage" value={`${selectedCar.mileage} KM/L`} />
                <DetailBox label="Color" value={selectedCar.color} />
                <DetailBox label="Category" value={selectedCar.category} />
              </div>
              <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{selectedCar.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminInventory;