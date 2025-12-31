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
            showToast("User deleted successfully");
        } catch (err) {
            showToast(
                err.response?.data?.message || "Error deleting user",
                "error"
            );
        } finally {
            setDeleteConfirm({ show: false, id: null, name: "" });
        }
    };

    const handleToggleStatus = async (e, user) => {
        e.stopPropagation();
        const newStatus = user.Status === "blocked" ? "approved" : "blocked";
        try {
            const res = await api.patch(`/admin/update-user-status/${user._id}`, { status: newStatus });
            if (res.data.success) {
                setUsers(users.map(u => u._id === user._id ? { ...u, Status: newStatus } : u));
                showToast(`User ${newStatus === 'approved' ? 'unblocked' : 'blocked'} successfully`);
            }
        } catch (err) {
            showToast("Failed to update status", "error");
        }
    };

    const filteredUsers = users.filter((user) => {
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
                                <p className="text-sm text-gray-500">Monitor and manage {users.length} registered accounts</p>
                            </div>

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
                                                            <div className="font-bold text-gray-900">{user.Name}</div>
                                                            <div className="text-xs text-gray-500">{user.Email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{user.role}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusColor(user.Status)}`}>
                                                        {user.Status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={(e) => handleToggleStatus(e, user)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Toggle Status"
                                                        >
                                                            <RotateCcw size={18} />
                                                        </button>
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

            {/* --- USER DETAILS MODAL (EXISTING) --- */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-blue-600 h-24 p-6 flex justify-end">
                            <button onClick={() => setSelectedUser(null)} className="text-white hover:rotate-90 transition-transform"><X /></button>
                        </div>
                        <div className="px-8 pb-8 text-center -mt-12">
                            <div className="inline-block p-1 bg-white rounded-2xl shadow-lg mb-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl">
                                    {selectedUser.Name.charAt(0)}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold">{selectedUser.Name}</h2>
                            <p className="text-gray-500 mb-6">{selectedUser.Email}</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Role</span>
                                    <span className="text-xs font-bold text-blue-600 uppercase">{selectedUser.role}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                                    <span className={`text-xs font-bold uppercase ${selectedUser.Status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedUser.Status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUser;