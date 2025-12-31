import React, { useState, useEffect } from "react";
import { 
  Car, Search, Filter, Eye, Trash2, 
  Fuel, Settings2, Gauge, Palette, 
  Info,LayoutDashboard,Users2,
  ShieldAlert,
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import api from "../../config/server";
import { ADMIN_LINKS, DEALER_LINKS } from "../../constants/Links";

const DealerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get("/dealer/get-inventory");
        console.log(res.data.cars)
        setInventory(res.data.cars);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

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
      <Header title="Dealer Control Center" />
      
      <div className="flex flex-1">
        <SideBar links={DEALER_LINKS}/>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-extrabold">Master Inventory</h1>
                <p className="text-sm text-gray-500">Managing {inventory.length} total active listings.</p>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-7 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search brand, model or title..." 
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Specs</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                       <tr><td colSpan="5" className="text-center py-20 text-gray-400 animate-pulse">Loading Inventory...</td></tr>
                    ) : filteredCars.map((car) => (
                      <tr key={car._id} className="hover:bg-blue-50/30 transition-colors group">
                        {/* 1. Vehicle Brand/Model */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                              <img 
                                src={`http://localhost:3000${car.images?.[0]}` || "https://via.placeholder.com/150"} 
                                alt={car.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{car.brand} {car.model}</div>
                              <div className="text-[11px] text-gray-500 font-medium truncate max-w-[150px]">{car.title}</div>
                              <div className="flex gap-2 mt-1">
                                <span className="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{car.year}</span>
                                <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{car.category}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Technical Specs */}
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Fuel size={14} className="text-gray-400" /> {car.fuelType}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Settings2 size={14} className="text-gray-400" /> {car.transmission}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Palette size={14} className="text-gray-400" /> {car.color}
                            </div>
                          </div>
                        </td>

                        {/* 3. Pricing & Mileage */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">₹{car.price.toLocaleString('en-IN')}</div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mt-1">
                            <Gauge size={12} /> {car.mileage} KM/L
                          </div>
                        </td>

                        {/* 4. Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            car.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-100' :
                            car.status === 'SOLD' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                          }`}>
                            {car.status}
                          </span>
                        </td>

                        {/* 5. Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2  transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DealerInventory;