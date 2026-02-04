import React from 'react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about-us' },
        { name: 'Dealer Login', href: '/login' },
        { name: 'Contact Support', href: '/about-us/#contact-us' },
      ],
    }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-car-side text-2xl text-primary"></i>
              <span className="text-xl font-bold">AutoNext</span>
            </div>
            <p className="text-gray-400 text-sm">The most trusted platform to buy cars directly from authorized dealers. Transparent pricing, verified inventory.</p>
          </div>

          {/* Columns 2 & 3: Links (Mapped) */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-gray-300 mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-primary">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          &copy; 2026 AutoNext. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;