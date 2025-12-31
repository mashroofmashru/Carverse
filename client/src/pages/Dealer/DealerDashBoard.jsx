import React, { useState, useEffect } from "react";
import {
  Car,
  Users2,
  DollarSign,
  PlusCircle,
  Plus,
  PhoneCall,
  FileText,
  UploadCloud,
  CheckCircle,
  Mail,
} from "lucide-react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import AddCarForm from "../../components/Details/AddCarForm";
import { DEALER_LINKS } from "../../constants/Links";
const DealerDashboard = () => {
  const [ShowAddVehicleform,setShowAddVehicleform]=useState(false)
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
        <Header title={"Dealer Portal"}/>
        <div id="dashboard-layout" className="flex min-h-[calc(100vh-4rem)]">
          <SideBar links={DEALER_LINKS}/>
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Welcome Back, Acme Motors!
            </h1>
            <p className="text-gray-500 mb-8">
              Here is a snapshot of your dealership performance and key tasks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

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
                    <button onClick={()=>setShowAddVehicleform(true)} className="w-full flex items-center justify-center py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-blue-200/50">
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Vehicle{ShowAddVehicleform}
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
      {ShowAddVehicleform&&(<AddCarForm onClose={() => setShowAddVehicleform(false)}/>)}
    </>
  );
};

export default DealerDashboard;
