import React from 'react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Inventory',
      links: [
        { name: 'New Arrivals', href: '#' },
        { name: 'Best Sellers', href: '#' },
        { name: 'Electric Vehicles', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Dealer Login', href: '#' },
        { name: 'Contact Support', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-car-side text-2xl text-primary"></i>
              <span className="text-xl font-bold text-gray-900">AutoNext</span>
            </div>
            <p className="text-gray-500 text-sm">The most trusted platform to buy cars directly from authorized dealers. Transparent pricing, verified inventory.</p>
          </div>

          {/* Columns 2 & 3: Links (Mapped) */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-gray-900 mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-primary">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Social Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Social</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-md transition"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-md transition"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-md transition"><i className="fa-brands fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          &copy; 2025 AutoNext. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;