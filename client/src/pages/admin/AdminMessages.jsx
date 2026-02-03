import React, { useState, useEffect } from "react";
import { MessageSquareText, Mail, Calendar, User, Search, Eye, Filter, X, Send } from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import api from "../../config/server";
import { ADMIN_LINKS } from "../../constants/Links";
import Toast from "../../components/common/Toast";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/get-contacts");
            setMessages(res.data.contacts || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
            showToast("Failed to fetch messages", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        if (message.status === 'new') {
            try {
                const res = await api.patch(`/admin/update-contact-status/${message._id}`, { status: 'read' });
                if (res.data.success) {
                    setMessages(prev => prev.map(m => m._id === message._id ? { ...m, status: 'read' } : m));
                }
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await api.patch(`/admin/update-contact-status/${id}`, { status: newStatus });
            if (res.data.success) {
                setMessages(prev => prev.map(m => m._id === id ? { ...m, status: newStatus } : m));
                if (selectedMessage && selectedMessage._id === id) {
                    setSelectedMessage(prev => ({ ...prev, status: newStatus }));
                }
                showToast(`Marked as ${newStatus}`);
            }
        } catch (err) {
            showToast("Failed to update status", "error");
        }
    };

    const handleReply = () => {
        if (!selectedMessage) return;

        const subject = encodeURIComponent("Response for the contact form in Autonext");
        const body = encodeURIComponent(`Dear ${selectedMessage.name},\n\nThank you for reaching out to us.\n\nRegarding your message:\n"${selectedMessage.message}"\n\n[Your response here]\n\nBest regards,\nAutoNext Support Team`);

        window.location.href = `mailto:${selectedMessage.email}?subject=${subject}&body=${body}`;

        handleStatusUpdate(selectedMessage._id, 'responded');
    };

    const filteredMessages = messages.filter((msg) => {
        const matchesSearch =
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'read': return 'bg-gray-100 text-gray-800';
            case 'responded': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-50 font-inter min-h-screen flex flex-col text-gray-900">
            <Header title={"Admin Portal"} />

            <div className="flex flex-1 relative min-h-[calc(100vh-4rem)]">
                <SideBar links={ADMIN_LINKS} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold flex items-center gap-2">
                                    <MessageSquareText className="text-blue-600" /> Messages
                                </h1>
                                <p className="text-sm text-gray-500">
                                    View and manage inquiries from the contact form.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                {/* Filter */}
                                <div className="relative">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="responded">Responded</option>
                                    </select>
                                    <Filter className="absolute left-3 top-1/4 text-gray-400" size={16} />
                                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/4 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Messages Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Sender</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Message</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr><td colSpan="6" className="text-center py-20 text-gray-400 animate-pulse">Loading Messages...</td></tr>
                                        ) : filteredMessages.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-20 text-gray-400">No messages found.</td></tr>
                                        ) : filteredMessages.map((msg) => (
                                            <tr key={msg._id} className="group hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                            {msg.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 leading-tight">{msg.name}</div>
                                                            <div className="text-xs text-gray-500">{msg.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-800">{msg.subject}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600 line-clamp-1 max-w-xs">{msg.message}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(msg.status)}`}>
                                                        {msg.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <span className="text-xs text-gray-500 font-medium">{formatDate(msg.createdAt)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleViewMessage(msg)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Message Details Modal */}
                {selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-900">Message Details</h3>
                                <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-900">{selectedMessage.name}</h4>
                                        <p className="text-blue-600 text-sm font-medium">{selectedMessage.email}</p>
                                        <p className="text-gray-400 text-xs mt-1">{formatDate(selectedMessage.createdAt)}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(selectedMessage.status)}`}>
                                        {selectedMessage.status}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</h5>
                                    <p className="font-semibold text-gray-900">{selectedMessage.subject}</p>
                                </div>

                                <div>
                                    <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Message Content</h5>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                                {selectedMessage.status == 'new' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedMessage._id, 'read')}
                                        className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                <button
                                    onClick={handleReply}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
                                >
                                    <Send size={18} /> Reply via Email
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Toast
                isOpen={toast.show}
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default AdminMessages;
