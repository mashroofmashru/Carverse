// src/pages/InventoryPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import FilterSidebar from "../components/Inventory/Filter/FilterSidebar";
import VehicleGrid from "../components/Inventory/Vehicles/VehicleGrid";
import SortBar from "../components/Inventory/common/SortBar";

//api
import api from "../config/server";


const InventoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalCount,setTotalCount] = useState()
  const [cars,setCars] = useState([])

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSidebarOpen]);

  useEffect(() => {
  let isMounted = true;

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(false);
      document.body.classList.remove("overflow-hidden");
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get("/featuredproducts");
      if (isMounted) {
        setCars(res.data.cars);
        setTotalCount(cars.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  handleResize();
  fetchCars();

  window.addEventListener("resize", handleResize);

  return () => {
    isMounted = false;
    window.removeEventListener("resize", handleResize);
  };
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
              <VehicleGrid vehicles={cars} />
              {/* <Pagination /> */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default InventoryPage;
