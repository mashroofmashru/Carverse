import React, { useEffect } from 'react'
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Car, CarFront, LayoutDashboard, Users2, BarChart3, Settings, LogOut, CalendarMinus2 } from "lucide-react";

function SideBar({ links = [] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 p-4 transition-transform duration-300 shadow-xl lg:shadow-none z-30
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0`}
      >
        <nav className="space-y-2 pt-4">
          <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4 px-3">
            Main
          </h3>
          {
            links.map((link, index) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <a
                  key={index} // Always add a key in a map
                  onClick={() => {
                    navigate(link.path);
                    if (onClose) onClose(); // Close mobile sidebar on click
                  }}
                  className={`flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer mb-1
        ${isActive
                      ? "bg-blue-600 text-white shadow-md"  // Active styles
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600" // Inactive styles
                    }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {link.title}
                </a>
              );
            })
          }

          {/* Sign Out Link */}
          <a
            onClick={() => { logout() }}
            className="flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition duration-150"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Sign Out
          </a>
        </nav>
      </aside>
    </div>
  )
}

export default SideBar
