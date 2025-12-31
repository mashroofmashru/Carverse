import React, { useState, useEffect } from "react";
import { 
  Mail, Phone, MessageSquare, Trash2, 
  Search, Calendar, ExternalLink, User 
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import api from "../../config/server";
import { DEALER_LINKS } from "../../constants/Links";

const DealerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get("/dealer/get-enquiries");
        setEnquiries(res.data.enquiries);
      } catch (err) {
        console.error("Error fetching enquiries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const filteredEnquiries = (Array.isArray(enquiries) ? enquiries : []).filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.carId?.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (enquiryId)=>{
    try {
      const res = await api.delete(`/dealer/delete-enquiry/${enquiryId}`);
      
      if (res.data.success) {
        setEnquiries((prev) => prev.filter((item) => item._id !== enquiryId));
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err);
      alert("Failed to delete enquiry. Please try again.");
    }
  }
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
                <h1 className="text-2xl font-extrabold">Customer Enquiries</h1>
                <p className="text-sm text-gray-500">You have {enquiries.length} total enquiries from potential buyers.</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-7 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by customer name or vehicle..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Interested Vehicle</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date Received</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                       <tr><td colSpan="5" className="text-center py-20 text-gray-400 animate-pulse">Loading Enquiries...</td></tr>
                    ) : filteredEnquiries.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-20 text-gray-400">No enquiries found.</td></tr>
                    ) : filteredEnquiries.map((item) => (
                      <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                        
                        {/* 1. Customer Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={20} />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{item.name}</div>
                              <div className="flex flex-col gap-0.5 mt-1">
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                  <Mail size={12} /> {item.email}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                  <Phone size={12} /> {item.phone}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Vehicle Info (Populated carId) */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">
                              {item.carId?.brand} {item.carId?.model}
                            </span>
                            <span className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-tight">
                              ID: {item.carId?._id.slice(-6)}
                            </span>
                          </div>
                        </td>

                        {/* 3. Message */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2 max-w-xs">
                            <MessageSquare size={14} className="text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-xs text-gray-600 leading-relaxed italic">
                              "{item.message || "No message provided."}"
                            </p>
                          </div>
                        </td>

                        {/* 4. Timestamp */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                          </div>
                        </td>

                        {/* 5. Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <a 
                                href={`mailto:${item.email}`}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Reply via Email"
                            >
                              <Mail size={18} />
                            </a>
                            <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default DealerEnquiries;