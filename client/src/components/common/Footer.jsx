import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

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
      { name: "About us", to: "/about-us" },
      { name: "Dealer login", to: "/login" },
      { name: "Contact support", to: "/about-us#contact-us" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-6">
            <Logo dark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              The trusted marketplace to buy cars directly from authorized dealers. Transparent pricing and verified
              inventory.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-slate-400 hover:text-white transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AutoNext. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
