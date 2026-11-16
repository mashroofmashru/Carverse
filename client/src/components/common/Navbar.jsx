import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Menu, X, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Inventory", href: "/viewInventory" },
  { name: "About Us", href: "/about-us" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenus = () => {
    setOpenMenu(false);
    setMobileOpen(false);
  };

  // Close the avatar dropdown on outside click or Escape
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

  const handleLogout = () => {
    setOpenMenu(false);
    setMobileOpen(false);
    logout();
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "dealer" ? "/dealer" : null;

  const linkClass = ({ isActive }) =>
    `transition hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : ""}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMenus} className="flex items-center gap-2" aria-label="AutoNext home">
          <i className="fa-solid fa-car-side text-2xl text-blue-600" aria-hidden="true"></i>
          <span className="text-xl font-bold tracking-tight text-gray-900">AutoNext</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.href} end={link.href === "/"} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              closeMenus();
              navigate("/viewInventory");
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Search cars"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          {!user && (
            <Link
              to="/login"
              className="hidden md:block px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}

          {user && (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpenMenu((o) => !o)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={openMenu}
              >
                {user?.Name?.charAt(0) || "U"}
              </button>

              {openMenu && (
                <div
                  role="menu"
                  onClick={closeMenus}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {dashboardPath && (
                    <Link
                      role="menuitem"
                      to={dashboardPath}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    role="menuitem"
                    to="/profile"
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <User size={16} />
                    View Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div id="mobile-menu" onClick={closeMenus} className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <div className="flex flex-col py-2 font-medium text-gray-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg hover:bg-gray-50 ${isActive ? "text-blue-600 font-semibold" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                {dashboardPath && (
                  <Link to={dashboardPath} className="px-3 py-3 rounded-lg hover:bg-gray-50 font-medium">
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="px-3 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                  <User size={16} /> View Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 border border-gray-200 rounded-xl font-semibold text-center hover:bg-gray-50"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
