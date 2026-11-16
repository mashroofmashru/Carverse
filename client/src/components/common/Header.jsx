import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import Logo from "./Logo";

const roleLabel = { admin: "Admin", dealer: "Dealer", user: "Customer" };

function Header({ title, showMenu = true }) {
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const initial = user?.Name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {showMenu && (
            <button
              type="button"
              className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={toggle}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className={showMenu ? "hidden sm:block" : ""}>
            <Logo />
          </div>

          {title && (
            <>
              <span className="hidden h-6 w-px bg-gray-200 sm:block" aria-hidden="true" />
              <span className="truncate text-base font-semibold text-gray-700">{title}</span>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[160px] truncate text-sm font-semibold text-gray-900">{user.Name}</p>
              <p className="text-xs text-gray-500">{roleLabel[user.role] || "Member"}</p>
            </div>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white"
              aria-hidden="true"
            >
              {initial}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
