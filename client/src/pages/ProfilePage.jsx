import React, { useState, useEffect } from "react";
import { User, Mail, Save, RefreshCcw, Phone, Package, Calendar, MapPin, X, Receipt } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import Toast from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";
import api from "../config/server";

const ProfilePage = () => {
    const { user, login, token } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("User");

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    };

    useEffect(() => {
        if (user) {
            setName(user.Name || "");
            setEmail(user.Email || "");
            setPhone(user.Phone || "");
            setRole(user.Role || "User");
            if (activeTab === "orders") {
                fetchOrders();
            }
        }
    }, [user, activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await api.get("/orders");
            if (res.data.success) {
                console.log(res.data.orders)
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!user?._id) return;

        setIsSaving(true);
        try {
            const res = await api.put(`/update-profile/${user._id}`, { // Using same endpoint as it updates user model
                Name: name,
                Email: email,
                Phone: phone
            });
            if (res.data.success) {
                showToast("Profile updated successfully!", "success");
                if (res.data.user) login(res.data.user, token);
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Error updating profile", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-inter">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
                                <div className="w-20 h-20 bg-primary backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 border-2 border-white/30">
                                    {name ? name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <h2 className="font-bold text-lg truncate text-gray-900">{name || "User"}</h2>
                                <p className="text-blue-400 text-xs">{email}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "profile"
                                        ? "bg-blue-50 text-blue-700 font-bold"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <User size={18} /> Profile Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "orders"
                                        ? "bg-blue-50 text-blue-700 font-bold"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Package size={18} /> My Orders
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {activeTab === "profile" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
                                        <p className="text-gray-500 text-sm mt-1">Manage your personal details and account settings.</p>
                                    </div>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSaving}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/4 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/3 text-gray-400" size={18} />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order History</h1>
                                    <p className="text-gray-500 text-sm">View details of all your vehicle purchases.</p>
                                </div>

                                {loadingOrders ? (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                        <RefreshCcw className="animate-spin text-blue-600 mx-auto mb-3" size={32} />
                                        <p className="text-gray-500 font-medium">Loading your orders...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <Package className="text-gray-300 mx-auto mb-4" size={48} />
                                        <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
                                        <p className="text-gray-500 mb-6">You haven't placed any orders with us yet.</p>
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Browse Cars</button>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                                    {/* Car Image Placeholder or Data */}
                                                    <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden">
                                                        {order.carId?.images?.[0] ? (
                                                            <img src={`http://localhost:3000${order.carId.images[0]}`} alt={order.carId.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                                <Package size={32} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-900">{order.carId?.title} {order.carId?.model}</h3>
                                                                <p className="text-sm text-gray-500">{order.carId?.year} • {order.carId?.fuelType}</p>
                                                            </div>
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full">
                                                                {order.carId?.status}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar size={14} className="text-gray-400" />
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Receipt size={14} className="text-gray-400" />
                                                                ₹{order.amount?.toLocaleString()}
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="text-blue-600 font-bold text-sm hover:underline"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Order Header */}
                            <div className="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Order ID</span>
                                    <span className="font-mono font-bold text-gray-900">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Amount</span>
                                    <span className="text-xl font-black text-blue-600">₹{selectedOrder.amount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Vehicle Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Vehicle Information</h3>
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {selectedOrder.carId?.images?.[0] && (
                                            <img src={`http://localhost:3000${selectedOrder.carId.images[0]}`} alt="Car" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {selectedOrder.carId?.brand} {selectedOrder.carId?.title}
                                        </h4>

                                        <p className="text-gray-600 text-sm">
                                            {selectedOrder.carId?.model} • {selectedOrder.carId?.year}
                                        </p>

                                        <p className="text-gray-600 text-sm">
                                            Color: {selectedOrder.carId?.color} • Fuel: {selectedOrder.carId?.fuelType}
                                        </p>

                                        <p className="text-gray-600 text-sm">
                                            Transmission: {selectedOrder.carId?.transmission} • Mileage: {selectedOrder.carId?.mileage} km
                                        </p>

                                        <p className="text-gray-600 text-sm">
                                            Category: {selectedOrder.carId?.category}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Dealer Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Dealer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block">Sold By</span>
                                        <span className="font-semibold text-gray-900">{selectedOrder.dealerId?.Name || "Dealer"}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Contact</span>
                                        <span className="font-semibold text-gray-900">{selectedOrder.dealerId?.Email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Payment Details</h3>
                                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Payment Method</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedOrder.paymentDetails?.method || "Credit Card"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Transaction ID</span>
                                        <span className="text-sm font-mono text-gray-500">{selectedOrder.paymentDetails?.transactionId || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Component */}
            <Footer />
            <Toast
                isOpen={notification.show}
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />
        </div>
    );
};

export default ProfilePage;
