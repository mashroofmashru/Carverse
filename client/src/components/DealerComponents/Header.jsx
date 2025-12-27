import React from 'react'
import {
  Menu,
  Car,
  Bell,
} from "lucide-react";
function Header() {
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  return (
    <div>
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
    </div>
  )
}

export default Header
