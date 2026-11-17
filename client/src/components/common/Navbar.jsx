import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, User, Menu, X, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Inventory", href: "/viewInventory" },
  { name: "About Us", href: "/about-us" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Stronger shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account dropdown on outside click or Escape
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpenMenu(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const closeMenus = () => {
    setOpenMenu(false);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    closeMenus();
    logout();
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "dealer" ? "/dealer" : null;
  const initial = user?.Name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-neutral-200 shadow-sm"
          : "bg-white border-neutral-200"
      }`}
    >
      <nav className="container mx-auto flex h-16 md:h-[72px] items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Logo onClick={closeMenus} />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-mist-deep border border-neutral-200 p-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  isActive ? "bg-brand text-ink" : "text-ink hover:bg-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!user && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-ink hover:text-ink/70 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark transition"
              >
                Get started
              </Link>
            </div>
          )}

          {user && (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpenMenu((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-neutral-200 py-1 pl-1 pr-3 hover:border-ink transition"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={openMenu}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">
                  {initial}
                </span>
                <span className="max-w-[120px] truncate text-sm font-semibold text-gray-700">{user.Name}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${openMenu ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {openMenu && (
                <div
                  role="menu"
                  onClick={closeMenus}
                  className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">{user.Name}</p>
                    <p className="truncate text-xs text-gray-500">{user.Email}</p>
                  </div>
                  <div className="p-1.5">
                    {dashboardPath && (
                      <Link
                        role="menuitem"
                        to={dashboardPath}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={16} className="text-gray-400" /> Dashboard
                      </Link>
                    )}
                    <Link
                      role="menuitem"
                      to="/profile"
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} className="text-gray-400" /> My profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden rounded-xl p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          onClick={closeMenus}
          className="md:hidden border-t border-neutral-200 bg-mist px-4 pb-6 pt-2 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200"
        >
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-ink">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{user.Name}</p>
                <p className="truncate text-xs text-gray-500">{user.Email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col py-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 font-semibold ${
                    isActive ? "bg-brand text-ink" : "text-ink hover:bg-mist-deep"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {user && dashboardPath && (
              <Link to={dashboardPath} className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}
            {user && (
              <Link to="/profile" className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                <User size={18} /> My profile
              </Link>
            )}
          </div>

          <div className="mt-3 border-t border-gray-100 pt-4">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Log out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-brand px-4 py-3 text-center font-semibold text-ink hover:bg-brand-dark"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
