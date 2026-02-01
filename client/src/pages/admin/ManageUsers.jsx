import React, { useState, useEffect } from "react";
import {
    Users2, Mail, Shield, X, User as UserIcon,
    Filter, Edit, Trash2, CheckCircle, AlertCircle,
    Menu, CheckCircle2, RotateCcw
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Toast from "../../components/common/Toast";
import api from "../../config/server";
import { ADMIN_LINKS } from "../../constants/Links";

const ManageUser = () => {
    // --- States ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState("all");
    const [activeTab, setActiveTab] = useState("all"); // "all" | "pending"
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: "" });
    const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/getusers");
            setUsers(Array.isArray(res.data.user) ? res.data.user : []);
        } catch (err) {
            console.error("Error fetching users:", err);
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    };

    const handleDeleteClick = (e, user) => {
        e.stopPropagation();
        setDeleteConfirm({ show: true, id: user._id, name: user.Name });
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/admin/delete-user/${deleteConfirm.id}`);
            setUsers(users.filter(u => u._id !== deleteConfirm.id));
            if (selectedUser?._id === deleteConfirm.id) setSelectedUser(null);
            showToast("User deleted successfully");
        } catch (err) {
            showToast(err.response?.data?.message || "Error deleting user", "error");
        } finally {
            setDeleteConfirm({ show: false, id: null, name: "" });
        }
    };

    const handleUpdateStatus = async (user, newStatus) => {
        try {
            const res = await api.patch(`/admin/update-user-status/${user._id}`, { status: newStatus });
            if (res.data.success) {
                setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
                if (selectedUser?._id === user._id) {
                    setSelectedUser({ ...selectedUser, status: newStatus });
                }
                showToast(`User ${newStatus} successfully`);
            }
        } catch (err) {
            showToast("Failed to update status", "error");
        }
    };

    const filteredUsers = users.filter((user) => {
        if (activeTab === "pending") {
            return user.role === "dealer" && user.status === "pending" && user.isApplied;
        }
        if (filterRole === "all") return true;
        return user.role.toLowerCase() === filterRole.toLowerCase();
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-50 text-green-700 border-green-100';
            case 'blocked': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        }
    };

    return (
        <div className="bg-gray-50 font-inter min-h-screen flex flex-col text-gray-900">
            <Header title={"Admin Portal"} />

            <div className="flex flex-1 relative min-h-[calc(100vh-4rem)]">
                <SideBar links={ADMIN_LINKS} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold flex items-center gap-2">
                                    <Users2 className="text-blue-600" /> User Management
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {activeTab === 'pending'
                                        ? `Reviewing ${filteredUsers.length} dealer registration requests`
                                        : `Monitor and manage all ${users.length} accounts`}
                                </p>
                            </div>

                            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    All Accounts
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Pending Requests
                                    {users.filter(u => u.status === 'pending' && u.isApplied).length > 0 && (
                                        <span className="w-5 h-5 bg-orange-200 text-orange-700 rounded-full text-[10px] flex items-center justify-center font-black">
                                            {users.filter(u => u.status === 'pending' && u.isApplied).length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Filters only show for "All Accounts" tab */}
                        {activeTab === 'all' && (
                            <div className="flex justify-end mb-4">
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                                    <Filter size={16} className="text-gray-400" />
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="text-sm font-bold outline-none bg-transparent cursor-pointer"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admins</option>
                                        <option value="dealer">Dealers</option>
                                        <option value="user">Users</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Profile</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-20 text-gray-400 animate-pulse">Loading Users...</td></tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-20 text-gray-400">No users found for this filter.</td></tr>
                                        ) : filteredUsers.map((user) => (
                                            <tr
                                                key={user._id}
                                                onClick={() => setSelectedUser(user)}
                                                className="group hover:bg-blue-50/40 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                                            {user.Name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 leading-tight">{user.Name}</div>
                                                            <div className="text-xs text-gray-500">{user.Email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{user.role}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusColor(user.status)}`}>
                                                        {user.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-end gap-2">
                                                        {user.status === 'pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(user, 'approved')}
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                                    title="Approve Dealer"
                                                                >
                                                                    <CheckCircle2 size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(user, 'blocked')}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                    title="Reject Dealer"
                                                                >
                                                                    <X size={20} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user, user.status === 'approved' ? 'blocked' : 'approved')}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Toggle Status"
                                                            >
                                                                <RotateCcw size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => handleDeleteClick(e, user)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete User"
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
                    </div>
                </main>
            </div>

            {deleteConfirm.show && (
                <ConfirmationModal
                    isOpen={deleteConfirm.show}
                    onClose={() => setDeleteConfirm({ show: false, id: null, name: "" })}
                    onConfirm={confirmDelete}
                    title="Delete User?"
                    message={
                        <>You are about to remove <span className="font-bold text-gray-900">{deleteConfirm.name}</span>. This data cannot be recovered.</>
                    }
                    confirmText="Delete"
                />
            )}

            <Toast
                isOpen={notification.show}
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />

            {/* --- USER DETAILS MODAL (ENHANCED) --- */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transition-all transform animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>

                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white relative">
                            <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center font-black text-3xl backdrop-blur-md">
                                    {selectedUser.Name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">{selectedUser.Name}</h2>
                                    <p className="text-blue-100 flex items-center gap-1.5 mt-1 text-sm">
                                        <Mail size={14} /> {selectedUser.Email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Role</span>
                                    <span className="font-bold text-blue-600 uppercase text-xs">{selectedUser.role}</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Account Status</span>
                                    <span className={`font-bold text-xs uppercase ${selectedUser.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {selectedUser.status || 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Dealer Specific Details (If submitted) */}
                            {selectedUser.role === 'dealer' && selectedUser.isApplied && (
                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                                        <Shield className="text-blue-600" size={16} /> Dealership Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                            <span className="text-[10px] font-black text-blue-400 uppercase block mb-1">Dealership Name</span>
                                            <p className="font-bold text-gray-900">{selectedUser.dealershipName || 'N/A'}</p>
                                        </div>
                                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                            <span className="text-[10px] font-black text-blue-400 uppercase block mb-1">Business License</span>
                                            <p className="font-bold text-gray-900 font-mono text-sm">{selectedUser.licenseNumber || 'N/A'}</p>
                                        </div>
                                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                            <span className="text-[10px] font-black text-blue-400 uppercase block mb-1">Showroom Address</span>
                                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{selectedUser.dealershipAddress || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-4">
                                {selectedUser.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedUser, 'approved')}
                                            className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedUser, 'blocked')}
                                            className="flex-1 py-4 bg-red-50 text-red-600 hover:bg-red-100 font-black rounded-2xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <AlertCircle size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleToggleStatus(null, selectedUser)}
                                        className={`flex-1 py-4 font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${selectedUser.status === 'approved' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-600 text-white shadow-xl shadow-green-200'}`}
                                    >
                                        {selectedUser.status === 'approved' ? <><AlertCircle size={18} /> Block User</> : <><CheckCircle size={18} /> Unblock User</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUser;