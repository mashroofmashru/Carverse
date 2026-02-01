import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Clock, RotateCcw, Building2, MapPin, FileBadge, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import api from '../../config/server';

const DealerApproval = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [dealershipName, setDealershipName] = useState('');
    const [dealershipAddress, setDealershipAddress] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');

    useEffect(() => {
        if (user?.status === 'approved') {
            navigate('/dealer');
        }
        if (user?.role !== 'dealer') {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const checkStatus = async () => {
        setChecking(true);
        try {
            const res = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
            });

            if (res.data.success) {
                login(res.data.user, localStorage.getItem('auth_token'));
                if (res.data.user.status === 'approved') {
                    navigate('/dealer');
                } else if (res.data.user.isApplied) {
                    alert('Your account is still under review. Please check back later.');
                }
            }
        } catch (error) {
            console.error("Failed to check status", error);
        } finally {
            setChecking(false);
        }
    };

    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('/auth/submit-dealer-details', {
                dealershipName,
                dealershipAddress,
                licenseNumber
            });
            if (res.data.success) {
                login(res.data.user, localStorage.getItem('auth_token'));
                alert('Details submitted successfully! Your account is now under review.');
            }
        } catch (error) {
            console.error("Failed to submit details", error);
            alert('Failed to submit details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-inter flex flex-col">
            <Header title="Dealer Verification" />

            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

                    {/* Top Banner */}
                    <div className="bg-blue-600 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            {user?.isApplied ? <Clock size={32} /> : <Building2 size={32} />}
                        </div>
                        <h1 className="text-2xl font-bold">
                            {user?.isApplied ? "Account Under Review" : "Complete Your Profile"}
                        </h1>
                        <p className="text-blue-100 mt-2 text-sm">
                            {user?.isApplied
                                ? "We're verifying your dealership details."
                                : "Provide your dealership information to request admin approval."}
                        </p>
                    </div>

                    <div className="p-8">
                        {user?.isApplied ? (
                            /* STATUS VIEW - When details are already submitted */
                            <div className="text-center">
                                <div className="bg-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-100">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Hello <span className="font-bold text-gray-900">{user?.Name}</span>, your request has been submitted.
                                        Our administrative team is currently reviewing your application.
                                    </p>
                                    <div className="flex flex-col gap-2 text-sm text-left max-w-xs mx-auto text-gray-500">
                                        <div className="flex justify-around">
                                            <span>Dealer Name:</span>
                                            <span className="font-semibold text-gray-900">{user?.dealershipName}</span>
                                        </div>
                                        <div className="flex justify-around">
                                            <span>License:</span>
                                            <span className="font-semibold text-gray-900">{user?.licenseNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={checkStatus}
                                        disabled={checking}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {checking ? <RotateCcw size={20} className="animate-spin" /> : "Check Status Again"}
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-3 text-gray-500 hover:text-gray-700 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* FORM VIEW - To collect dealer details */
                            <form onSubmit={handleSubmitDetails} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dealership Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={dealershipName}
                                            onChange={(e) => setDealershipName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. Prime Motors Ltd."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dealership Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-5 text-gray-400" size={18} />
                                        <textarea
                                            required
                                            rows="3"
                                            value={dealershipAddress}
                                            onChange={(e) => setDealershipAddress(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                                            placeholder="Complete physical address of your showroom..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Business License / Tax ID</label>
                                    <div className="relative">
                                        <FileBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={licenseNumber}
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. LIC-987654321"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {submitting ? <RotateCcw size={20} className="animate-spin" /> : <><Send size={18} /> Submit for Approval</>}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full py-3 text-gray-500 hover:text-gray-700 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <ShieldCheck size={12} /> Your data is encrypted and secure with AutoNext.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerApproval;
