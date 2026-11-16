import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const NotFound = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">404</p>
      <h1 className="mt-2 text-4xl font-black text-gray-900">Page not found</h1>
      <p className="mt-3 text-gray-500">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
          Go home
        </Link>
        <Link
          to="/viewInventory"
          className="px-6 py-3 border border-gray-200 bg-white rounded-xl font-semibold hover:bg-gray-50"
        >
          Browse inventory
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
