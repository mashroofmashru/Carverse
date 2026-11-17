import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, ReceiptText, ShoppingBag } from "lucide-react";
import Logo from "./Logo";

const points = [
  { icon: BadgeCheck, text: "Buy from verified dealers" },
  { icon: ReceiptText, text: "Transparent pricing, no hidden fees" },
  { icon: ShoppingBag, text: "Order directly on the platform" },
];

// Split-screen shell shared by Login and Signup: brand panel on the left (lg+), form on the right.
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-white grid lg:grid-cols-2">
    <aside data-surface="ink" className="hidden lg:flex flex-col justify-between bg-night text-white p-12 relative overflow-hidden">
      <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-brand/90" aria-hidden="true" />
      <div className="absolute -right-4 -bottom-4 h-56 w-56 rounded-full bg-night" aria-hidden="true" />
      <Logo dark />
      <div className="relative z-10 max-w-md">
        <h2 className="font-display text-4xl font-bold leading-tight tracking-tight">
          Your next car, <span className="text-brand">straight from the dealer.</span>
        </h2>
        <ul className="mt-8 space-y-4">
          {points.map(({ icon, text }) => {
            const Icon = icon;
            return (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-ink">
                  <Icon size={18} aria-hidden="true" />
                </span>
                {text}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="relative z-10 text-sm text-white/60">&copy; {new Date().getFullYear()} Carverse</p>
    </aside>

    <main className="flex flex-col justify-center px-4 sm:px-10 py-10 bg-mist lg:bg-white">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to home
          </Link>
          <div className="lg:hidden">
            <Logo />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}

        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-gray-600">{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;
