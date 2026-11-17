import React from "react";
import { Link } from "react-router-dom";
import { CarFront } from "lucide-react";

// Brand mark used by the navbar and footer
const Logo = ({ dark = false, onClick }) => (
  <Link
    to="/"
    onClick={onClick}
    className={`flex items-center gap-2.5 group rounded-md focus-visible:outline-3 focus-visible:outline-offset-4 ${
      dark ? "focus-visible:outline-brand" : "focus-visible:outline-ink"
    }`}
    aria-label="Carverse home"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand transition-transform group-hover:scale-105">
      <CarFront className="h-5 w-5 text-ink" strokeWidth={2.25} aria-hidden="true" />
    </span>
    <span className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
      Car<span className={dark ? "text-brand" : "text-ink"}>verse</span>
    </span>
  </Link>
);

export default Logo;
