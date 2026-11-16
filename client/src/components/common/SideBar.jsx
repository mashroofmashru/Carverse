import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";

function SideBar({ links = [] }) {
  const { logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const location = useLocation();

  // Close the mobile sidebar when the screen becomes desktop-sized or the page changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) close();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [close]);

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={close} aria-hidden="true" />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 p-4 transition-transform duration-300 shadow-xl z-50
          lg:static lg:z-auto lg:shadow-none lg:translate-x-0 lg:shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Dashboard navigation"
      >
        <div className="flex justify-end lg:hidden">
          <button
            type="button"
            onClick={close}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2 pt-4">
          <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4 px-3">Main</h3>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-150 mb-1 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400"}`} />
                {link.title}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition duration-150 cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Sign Out
          </button>
        </nav>
      </aside>
    </>
  );
}

export default SideBar;
