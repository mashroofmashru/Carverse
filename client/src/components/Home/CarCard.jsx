import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CarCard = ({ car }) => {
  const { _id, title, details, dealer, price, imgUrl, tag } = car;

  return (
    <Link
      to={`/details/${_id}`}
      className="group transition hover:shadow-xl motion-safe:hover:-translate-y-1 block bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      <div className="relative h-56 bg-mist-deep border-b border-neutral-200 overflow-hidden">
        {tag && (
          <span className="absolute top-3 left-3 z-10 bg-brand text-ink text-xs font-semibold px-2.5 py-1 rounded-md">
            {tag}
          </span>
        )}
        {imgUrl && (
          <img
            src={imgUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight line-clamp-2">{title}</h3>
          <ArrowUpRight className="shrink-0 text-ink/60 group-hover:text-ink/70 transition" size={22} aria-hidden="true" />
        </div>
        <p className="mt-1 text-sm text-ink/70">{details}</p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-neutral-200 pt-4">
          <span className="font-display text-2xl font-bold">{price}</span>
          <span className="text-xs text-ink/70 text-right truncate max-w-[50%]">
            by <strong className="text-ink">{dealer}</strong>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
