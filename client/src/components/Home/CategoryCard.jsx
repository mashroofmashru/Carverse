import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CategoryCard = ({ icon, title, to }) => {
  const Icon = icon;
  return (
    <Link
      to={to}
      className="group transition hover:shadow-xl motion-safe:hover:-translate-y-1 relative block bg-mist text-ink rounded-xl border border-neutral-200 p-6 min-h-44 shadow-sm focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <ArrowUpRight
        className="absolute top-4 right-4 text-ink/60 group-hover:text-ink/70 transition"
        size={22}
        aria-hidden="true"
      />
      <Icon className="h-12 w-12 text-ink mb-8" strokeWidth={1.5} aria-hidden="true" />
      <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
    </Link>
  );
};

export default CategoryCard;
