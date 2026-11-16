import React from "react";
import { Menu, Car } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";

function Header({ title, showMenu = true }) {
  const { user } = useAuth();
  const { toggle } = useSidebar();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0">
            {showMenu && (
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-3 transition"
                onClick={toggle}
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <Car className="text-primary w-6 h-6 shrink-0" />
              <span className="text-xl font-bold tracking-tight text-gray-900 truncate">{title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user?.Name}</span>
            <div
              className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full border border-primary/50 text-primary font-semibold"
              aria-hidden="true"
            >
              {user?.Name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
