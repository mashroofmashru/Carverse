import React from 'react';

const Navbar = () => {
  // A simple way to handle navigation links data
  const navLinks = [
    { name: 'Home', href: '/', isPrimary: true },
    { name: 'Inventory', href: '/viewinventory', isPrimary: false },
    { name: 'Contact', href: '/contact', isPrimary: false },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-car-side text-2xl text-blue-600"></i>
          <span className="text-xl font-bold tracking-tight text-gray-900">CarVerse</span>
        </div>
        
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className={link.isPrimary 
                ? "text-blue-600 border-b-2 border-blue-600 pb-1" 
                : "text-gray-600 hover:text-blue-600 transition"}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full"><i className="fa-solid fa-magnifying-glass"></i></button>
          <button 
            className="hidden md:block px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition" 
            onClick={() => alert("signupClicked")} // Use window.location for external navigation
          >
            Sign In
          </button>
          <button className="md:hidden text-2xl"><i className="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;