import React, { useState } from "react";
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
  const adminLinks = [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "User Management", path: "/admin/users", icon: Users2 },
    { title: "Inventory", path: `/dealer/cars`, icon: Car },
    { title: "Security Logs", path: "/admin/logs", icon: ShieldAlert },
  ];

  

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
              <StatCard title="Total Platform Users" value="14,208" icon={Users2} trend="+12%" color="blue" />
              <StatCard title="Active Dealerships" value="382" icon={TrendingUp} trend="+5%" color="green" />
              <StatCard title="System Uptime" value="99.9%" icon={Server} trend="Stable" color="purple" />
              <StatCard title="Pending Reports" value="23" icon={AlertTriangle} trend="Urgent" color="red" />
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