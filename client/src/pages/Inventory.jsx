// src/pages/InventoryPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import FilterSidebar from "../components/Inventory/Filter/FilterSidebar";
import VehicleGrid from "../components/Inventory/Vehicles/VehicleGrid";
import SortBar from "../components/Inventory/common/SortBar";
import Pagination from "../components/Inventory/common/Pagination";
const vehiclesMock = [
  {
    id: 1,
    title: "Audi Q5 Premium Plus",
    miles: 38000,
    transmission: "Automatic",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: 2,
    title: "Honda Civic EX",
    miles: 62500,
    transmission: "CVT",
    price: 18500,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1654870646430-e5b6f2c0fa93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: 3,
    title: "Ford F-150 XLT",
    miles: 11000,
    transmission: "V6 Turbo",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: 4,
    title: "Tesla Model 3",
    miles: 25500,
    transmission: "Electric",
    price: 26800,
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: 5,
    title: "Toyota Camry LE",
    miles: 98000,
    transmission: "Automatic",
    price: 12900,
    image:
      "https://images.unsplash.com/photo-1624578571415-09e9b1991929?q=80&w=690&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: 6,
    title: "BMW X7 xDrive40i",
    miles: 15000,
    transmission: "Automatic",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1731988666894-482242ceae2f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
];

const InventoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const totalCount = vehiclesMock.length;

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
        document.body.classList.remove("overflow-hidden");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="bg-gray-50 font-inter min-h-screen">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Inventory Search
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Showing {totalCount} results found across all dealerships.
          </p>

          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden w-full mb-6 py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-xl flex items-center justify-center shadow-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-2 2v-4.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Show Filters
          </button>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <FilterSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onApply={() => console.log("Apply filters")}
              onReset={() => console.log("Reset filters")}
            />

            <div
              id="sidebar-overlay"
              className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${
                isSidebarOpen ? "" : "hidden"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="lg:col-span-3">
              <SortBar totalCount={totalCount} />
              <VehicleGrid vehicles={vehiclesMock} />
              <Pagination />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default InventoryPage;
