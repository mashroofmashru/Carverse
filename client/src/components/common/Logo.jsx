import React from "react";
import { Link } from "react-router-dom";
import { CarFront } from "lucide-react";

// Brand mark used by the navbar and footer
const Logo = ({ dark = false, onClick }) => (
  <Link to="/" onClick={onClick} className="flex items-center gap-2.5 group" aria-label="AutoNext home">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-600/30 transition-transform group-hover:scale-105">
      <CarFront className="h-5 w-5 text-white" strokeWidth={2.25} aria-hidden="true" />
    </span>
    <span className={`text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
      Auto<span className="text-blue-600">Next</span>
    </span>
  </Link>
);

export default Logo;
