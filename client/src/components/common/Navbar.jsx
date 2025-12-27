import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Inventory", href: "/viewinventory" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-car-side text-2xl text-blue-600"></i>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            AutoNext
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.href)}
              className="hover:text-blue-600 transition"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 relative">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* ❌ Not logged in */}
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}

          {/* ✅ Logged in */}
          {user && (
            <div className="relative">
              {/* Avatar */}
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase"
              >
                {user?.Name?.charAt(0) || "U"}
              </button>

              {/* Dropdown */}
              {openMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <User size={16} />
                    View Profile
                  </button>

                  <button
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

          {/* Mobile menu */}
          <button className="md:hidden text-2xl">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
