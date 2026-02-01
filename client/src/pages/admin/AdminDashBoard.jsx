import React, { useState, useEffect } from "react";
import api from "../../config/server";
import {
  Users2,
  Car,
  ShieldAlert,
  TrendingUp,
  Activity,
  UserPlus,
  Server,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import StatCard from "../../components/Dashboard/StateCard";
import ActionButton from "../../components/Dashboard/ActionButton";
import LogItem from "../../components/Dashboard/LogItem";
import { ADMIN_LINKS } from "../../constants/Links";

const AdminDashBoard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalInventory: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/get-dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (num) => {
    if (!num) return '0';
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="bg-gray-50 font-inter min-h-screen flex flex-col">
      <Header title={"Admin Control Center"} />

      <div id="dashboard-layout" className="flex min-h-[calc(100vh-4rem)]">
        <SideBar links={ADMIN_LINKS} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">System Overview</h1>
              <p className="text-gray-500 mt-2">Global platform health and user analytics.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.totalUsers} icon={Users2} color="blue" />
              <StatCard title="Active Dealerships" value={stats.totalDealers} icon={TrendingUp} color="purple" />
              <StatCard title="Total Revenue" value={`₹${formatCurrency(stats.totalRevenue)}`} icon={Activity} color="green" />
              <StatCard title="Total Profit" value={`₹${formatCurrency(stats.totalProfit)}`} icon={TrendingUp} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="lg:col-span-2 space-y-6">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Recent System Logs</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <LogItem status="security" title="Failed Login Attempt" user="admin_mush" time="2 mins ago" />
                    <LogItem status="success" title="New Dealer Verified" user="Prime Autos Ltd" time="15 mins ago" />
                    <LogItem status="warning" title="High CPU Usage" user="Worker Node 4" time="1 hour ago" />
                    <LogItem status="security" title="Password Reset" user="mus@g.c" time="3 hours ago" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashBoard;