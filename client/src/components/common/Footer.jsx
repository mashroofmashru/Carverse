import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Home", to: "/" },
      { name: "Inventory", to: "/viewInventory" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", to: "/about-us" },
      { name: "Dealer Login", to: "/login" },
      { name: "Contact Support", to: "/about-us#contact-us" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="AutoNext home">
              <i className="fa-solid fa-car-side text-2xl text-primary" aria-hidden="true"></i>
              <span className="text-xl font-bold">AutoNext</span>
            </Link>
            <p className="text-gray-400 text-sm">
              The most trusted platform to buy cars directly from authorized dealers. Transparent pricing,
              verified inventory.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-gray-300 mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="hover:text-white transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AutoNext. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
