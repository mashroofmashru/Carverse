import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ReceiptText, ShoppingBag } from 'lucide-react';

const perks = [
  { icon: BadgeCheck, text: 'Verified dealers only' },
  { icon: ReceiptText, text: 'Transparent pricing' },
  { icon: ShoppingBag, text: 'Order directly online' },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 py-14 md:py-24 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 relative z-10">
          <p className="eyebrow mb-5">Used cars · Verified dealers</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Buy cars straight from{' '}
            <span className="inline-block bg-brand px-3 rounded-lg">the dealer.</span>
          </h1>
          <p className="mt-7 text-lg text-ink/80 max-w-lg leading-relaxed">
            Skip the middleman. Browse certified vehicles, compare dealer prices, and place your order online in a few
            clicks.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/viewInventory" className="btn btn-brand">
              Browse inventory <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/about-us" className="btn btn-light">
              How it works
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {perks.map(({ icon, text }) => {
              const Icon = icon;
              return (
                <li key={text} className="flex items-center gap-2 text-sm font-semibold">
                  <Icon size={18} className="text-ink" aria-hidden="true" />
                  {text}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="md:col-span-6 relative pr-4 pb-4">
          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-brand rounded-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl bg-mist-deep shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="A parked sports car"
              className="w-full aspect-[4/3] object-cover rounded-2xl"
            />
            <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-night text-white px-4 py-3 rounded-xl shadow-lg">
              <p className="eyebrow text-brand">Fresh listings</p>
              <p className="font-display text-lg font-bold">Added every week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
