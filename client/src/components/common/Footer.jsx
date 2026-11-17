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
    <footer data-surface="ink" className="bg-ink text-white border-t-4 border-brand">
      <div className="container mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-6">
            <Logo dark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              The trusted marketplace to buy cars directly from authorized dealers. Transparent pricing and verified
              inventory.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <h3 className="eyebrow text-brand">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-white/80 hover:text-brand hover:underline underline-offset-4 transition focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/15 pt-8 text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} Carverse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
