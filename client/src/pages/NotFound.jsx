import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const NotFound = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Navbar />
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="font-display text-8xl sm:text-9xl font-bold tracking-tight text-ink leading-none">
        4<span className="inline-block bg-brand rounded-2xl px-3 mx-1">0</span>4
      </p>
      <h1 className="mt-8 text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-3 text-gray-600 max-w-md">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn btn-brand">
          <ArrowLeft size={18} aria-hidden="true" /> Go home
        </Link>
        <Link to="/viewInventory" className="btn btn-light">
          Browse inventory
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
