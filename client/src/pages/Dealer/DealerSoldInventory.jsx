import React, { useState, useEffect } from "react";
import {
  Car, Search, Eye, Trash2,
  Fuel, Settings2, Gauge, Palette, X,
  AlertCircle, CheckCircle2, User, Calendar
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import DetailBox from "../../components/Dashboard/DetailBox";
import api from "../../config/server";
import { DEALER_LINKS } from "../../constants/Links";

const DealerSoldInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // This state will become unused
  const [selectedCar, setSelectedCar] = useState(null);

  // --- Alert & Notification States ---
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/dealer/get-sold-cars");
      setInventory(res.data.orders);
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

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/dealer/delete-order-car/${deleteConfirm.id}`);
      setInventory(inventory.filter(order => order._id !== deleteConfirm.id));
      showToast("Sold vehicle record deleted successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete sold vehicle record", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, title: "" });
    }
  };

  // Filter Logic
  const filteredOrders = (Array.isArray(inventory) ? inventory : []).filter((order) => {
    if (!order.carId) return false; // Ensure carId exists
    const matchesSearch =
      order.carId.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.carId.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.Name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-inter text-gray-900">
      <Header title="Dealer Portal" />

      <div className="flex flex-1">
        <SideBar links={DEALER_LINKS} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-8">Sold Vehicles History</h1>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by vehicle or buyer name..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Vehicle Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Buyer Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sale Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sale Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-20 text-gray-400 animate-pulse">Loading Sales History...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-20 text-gray-400">No sold vehicles history found.</td></tr>
                  ) : filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={`http://localhost:3000${order.carId.images?.[0]}`}
                            className="w-20 h-14 object-cover rounded-lg"
                            alt={order.carId.title}
                          />
                          <div>
                            <div className="font-bold text-gray-900">{order.carId.brand} {order.carId.model}</div>
                            <div className="text-[11px] text-gray-500">{order.carId.year} • {order.carId.fuelType}</div>
                            <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">SOLD</div>
                          </div>
                        </div >
                      </td >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {order.userId?.Name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{order.customerDetails?.fullName || order.userId?.Name || "Unknown"}</div>
                            <div className="text-xs text-gray-500">{order.customerDetails?.city ? `${order.customerDetails.city}, ${order.customerDetails.zipCode}` : order.userId?.Email}</div>
                            {order.customerDetails?.address && <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[150px]">{order.customerDetails.address}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-gray-900">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedCar(order.carId)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Eye size={18} /></button>
                          {/* Removing Delete for Sold Cars for now or keeping it? The user might want to hide history. Keeping it but warning. */}
                          <button
                            onClick={() => setDeleteConfirm({ show: true, id: order._id, title: `${order.carId.brand} ${order.carId.model} (History)` })}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition opacity-50 hover:opacity-100"
                            title="Remove Record"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr >
                  ))}
                </tbody >
              </table >
            </div >
          </div >
        </main >
      </div >

      {/* --- CUSTOM ALERT BOX (DELETE CONFIRMATION) --- */}
      {
        deleteConfirm.show && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Remove Vehicle Record?</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  You are about to delete the history of <span className="font-bold text-gray-800">{deleteConfirm.title}</span>. This data will be permanently removed.
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
        )
      }

      {/* --- NOTIFICATION TOAST --- */}
      {
        notification.show && (
          <div className={`fixed bottom-8 right-8 z-[70] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
            }`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        )
      }

      {/* --- EYE (VIEW MODAL) --- */}
      {
        selectedCar && (
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
        )
      }
    </div >
  );
};

export default DealerSoldInventory;