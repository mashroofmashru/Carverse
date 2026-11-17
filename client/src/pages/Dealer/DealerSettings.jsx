import React, { useState, useEffect } from "react";
import { User, Mail, Save, RefreshCcw, Phone } from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import Toast from "../../components/common/Toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/server";
import { DEALER_LINKS } from "../../constants/Links";

const DealerSettings = () => {
    const { user, login } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState();
    const [role, setRole] = useState("Dealer");

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
            setRole(user.Role || "Dealer");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!user?._id) return showToast("User ID not found.", "error");

        setIsSaving(true);
        try {
            const res = await api.put(`/dealer/update-profile/${user._id}`, {
                Name: name,
                Email: email,
                Phone: phone
            });
            if (res.data.success) {
                showToast(res.data.message || "updated successfully!", "success");
                // Update user context with new data
                login(res.data.user);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Error updating data";
            showToast(errorMsg, "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-mist min-h-screen flex flex-col font-sans">
            <Header title="Dealer Settings" />
            <div className="flex flex-1">
                <SideBar links={DEALER_LINKS} />
                <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto">

                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Dealer Profile</h1>
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="bg-brand hover:bg-brand-dark text-ink px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                            >
                                {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                                {isSaving ? "Saving..." : "Update Profile"}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Card Summary */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6">
                                <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center text-ink text-2xl font-bold">
                                    {name ? name.charAt(0).toUpperCase() : "D"}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{name || "Dealer"}</h2>
                                    <p className="text-xs font-bold text-ink uppercase tracking-widest">{role}</p>
                                </div>
                            </section>

                            {/* Input Fields */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Full Name Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter full name"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand/60 focus:outline-2 focus:outline-ink transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter email address"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand/60 focus:outline-2 focus:outline-ink transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={18} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand/60 focus:outline-2 focus:outline-ink transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Static User ID Display */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">User ID (Permanent)</label>
                                    <div className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-mono border border-gray-100">
                                        {user?._id || "N/A"}
                                    </div>
                                </div>

                            </section>
                        </div>
                    </div>
                </main>
            </div>
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

export default DealerSettings;
