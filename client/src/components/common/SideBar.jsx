import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import Logo from "./Logo";

function SideBar({ links = [] }) {
  const { logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const location = useLocation();

  // Close the mobile drawer when the screen becomes desktop-sized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) close();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [close]);

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
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden animate-in fade-in duration-200"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300
          lg:sticky lg:top-16 lg:z-auto lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
        aria-label="Dashboard navigation"
      >
        {/* Mobile drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 lg:hidden">
          <Logo onClick={close} />
          <button
            type="button"
            onClick={close}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Menu</p>
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={close}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" aria-hidden="true" />
                    )}
                    <Icon
                      className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                      aria-hidden="true"
                    />
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={() => {
              close();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
