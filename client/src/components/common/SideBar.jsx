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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden animate-in fade-in duration-200"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-300
          lg:sticky lg:top-16 lg:z-auto lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
        aria-label="Dashboard navigation"
      >
        {/* Mobile drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 lg:hidden">
          <Logo onClick={close} />
          <button type="button" onClick={close} className="icon-btn" aria-label="Close navigation menu">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Menu</p>
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
                    className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      isActive ? "bg-brand text-ink font-semibold" : "text-gray-700 hover:bg-mist-deep hover:text-ink"
                    }`}
                  >
                    <Icon size={20} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-neutral-200 p-3">
          <button
            type="button"
            onClick={() => {
              close();
              logout();
            }}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <LogOut size={20} className="shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
