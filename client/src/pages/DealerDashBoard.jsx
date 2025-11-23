import React, { useState, useEffect } from "react";
import {
  Menu,
  Car,
  LayoutDashboard,
  Users2,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  DollarSign,
  PlusCircle,
  Plus,
  PhoneCall,
  FileText,
  UploadCloud,
  CheckCircle,
  Mail,
} from "lucide-react";

const DealerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* You can move this into a global CSS file or Tailwind config if you like */}
      <style>{`
        .font-inter { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .text-primary { color: #2563eb; }
        .bg-primary { background-color: #2563eb; }
        .hover\\:bg-primary-dark:hover { background-color: #1d4ed8; }
        .shadow-primary { box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1), 0 4px 6px -2px rgba(37, 99, 235, 0.05); }
      `}</style>

      <div className="bg-gray-50 font-inter min-h-screen flex flex-col">
        {/* Header / Top Navigation */}
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <div className="flex items-center">
                <button
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-3 transition"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <Car className="text-primary w-6 h-6" />
                  <span className="text-xl font-bold tracking-tight text-gray-900">
                    Dealer Portal
                  </span>
                </div>
              </div>

              {/* Right Side: User & Notifications */}
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    Acme Motors
                  </span>
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full border border-primary/50 text-primary font-semibold">
                    AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout Container */}
        <div id="dashboard-layout" className="flex min-h-[calc(100vh-4rem)]">
          {/* Sidebar Navigation */}
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}

          <aside
            id="sidebar"
            className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 p-4 transition-transform duration-300 shadow-xl lg:shadow-none z-50
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0`}
          >
            <nav className="space-y-2 pt-4">
              <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4 px-3">
                Main
              </h3>

              {/* Dashboard Link (Active) */}
              <a
                href="/dealer/home.html"
                className="flex items-center px-3 py-3 text-sm font-semibold text-white bg-primary rounded-xl shadow-md transition duration-150"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </a>

              {/* Inventory Link */}
              <a
                href="/dealer/inventory.html"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition duration-150"
              >
                <Car className="w-5 h-5 mr-3 text-gray-500" />
                Inventory
              </a>

              {/* Leads Link */}
              <a
                href="/dealer/sales.html"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition duration-150"
              >
                <Users2 className="w-5 h-5 mr-3 text-gray-500" />
                Sales Leads
              </a>

              {/* Reports Link */}
              <a
                href="/dealer/analysis.html"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition duration-150"
              >
                <BarChart3 className="w-5 h-5 mr-3 text-gray-500" />
                Reports &amp; Analytics
              </a>

              <h3 className="text-xs font-semibold uppercase text-gray-400 pt-6 mb-4 px-3">
                Tools
              </h3>

              {/* Settings Link */}
              <a
                href="/dealer/settings.html"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition duration-150"
              >
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                Settings
              </a>

              {/* Sign Out Link */}
              <a
                href="#"
                className="flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition duration-150"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                Sign Out
              </a>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Welcome Back, Acme Motors!
            </h1>
            <p className="text-gray-500 mb-8">
              Here is a snapshot of your dealership performance and key tasks.
            </p>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* KPI Card 1: Total Inventory */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Inventory
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">245</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-primary">
                  <Car className="w-6 h-6" />
                </div>
              </div>

              {/* KPI Card 2: Active Leads */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Leads
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">87</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                  <Users2 className="w-6 h-6" />
                </div>
              </div>

              {/* KPI Card 3: Sales YTD */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Sales YTD
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">$1.8M</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* KPI Card 4: New Listings Today */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    New Listings Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">4</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                  <PlusCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Main Dashboard Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2/3: Activity & Chart */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Recent Activity Log
                    </h2>
                    <button className="text-sm text-primary font-medium hover:text-blue-700 transition">
                      View All
                    </button>
                  </div>

                  <ul className="divide-y divide-gray-100">
                    {/* Activity Item 1 */}
                    <li className="py-3 flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Vehicle Sold: Tesla Model Y
                        </p>
                        <p className="text-sm text-gray-500">
                          Sale closed by Jane Doe. Profit: $5,200.
                        </p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        5 min ago
                      </span>
                    </li>

                    {/* Activity Item 2 */}
                    <li className="py-3 flex items-start space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 mt-1">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          New Lead Received: John Smith
                        </p>
                        <p className="text-sm text-gray-500">
                          Interested in Ford F-150. Assign to sales.
                        </p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        1 hour ago
                      </span>
                    </li>

                    {/* Activity Item 3 */}
                    <li className="py-3 flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-primary mt-1">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Inventory Update
                        </p>
                        <p className="text-sm text-gray-500">
                          4 new vehicles successfully listed for sale.
                        </p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        3 hours ago
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Sales/Chart Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-80 flex items-center justify-center">
                  <p className="text-gray-400 font-medium text-lg">
                    Monthly Sales Performance Chart Placeholder
                  </p>
                </div>
              </div>

              {/* Right 1/3: Quick Actions & Inventory */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Actions Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-blue-200/50">
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Vehicle
                    </button>
                    <button className="w-full flex items-center justify-center py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                      <PhoneCall className="w-5 h-5 mr-2" />
                      Contact Next Lead
                    </button>
                    <button className="w-full flex items-center justify-center py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Report
                    </button>
                  </div>
                </div>

                {/* Top Inventory Snapshot Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Top Inventory
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-medium">
                        Ford Mustang
                      </span>
                      <span className="font-bold text-lg text-primary">12</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-medium">
                        Honda CR-V
                      </span>
                      <span className="font-bold text-lg text-primary">10</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-medium">
                        Toyota Tacoma
                      </span>
                      <span className="font-bold text-lg text-primary">9</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DealerDashboard;
