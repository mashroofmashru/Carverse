import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ArrowDownAZ, X, Tag } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../config/server";
import CarCard from "../components/Home/CarCard";
import { toCarCard } from "../utils/car";
import { label } from "../utils/format";

const CATEGORIES = ["SUVs", "SEDAN", "HATCHBACK", "ELECTRIC"];

const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/getInventory");
      setCars(res.data.cars || []);
    } catch (err) {
      console.error("API Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("category", value);
    else next.delete("category");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
  };

  // Filter & sort
  const filteredCars = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const result = cars.filter((car) => {
      if (car.status === "SOLD") return false;
      if (category && car.category !== category) return false;
      return (
        s === "" ||
        car.title?.toLowerCase().includes(s) ||
        car.brand?.toLowerCase().includes(s) ||
        car.model?.toLowerCase().includes(s)
      );
    });

    if (sortBy === "priceLow") result.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [cars, searchTerm, sortBy, category]);

  const hasFilters = Boolean(category || searchTerm.trim());

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
            {category ? `${label(category)} Inventory` : "Inventory Search"}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {loading ? "Loading cars…" : `${filteredCars.length} ${filteredCars.length === 1 ? "car" : "cars"} available`}
          </p>
        </div>

        {/* Search, category and sort */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
              aria-hidden="true"
            />
            <label htmlFor="inventory-search" className="sr-only">
              Search cars
            </label>
            <input
              id="inventory-search"
              type="search"
              placeholder="Search by brand, model, or keyword..."
              className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-gray-50 px-6 py-4 rounded-[2rem] gap-3 w-full md:w-auto">
            <Tag size={18} className="text-blue-600 shrink-0" aria-hidden="true" />
            <label htmlFor="inventory-category" className="sr-only">
              Category
            </label>
            <select
              id="inventory-category"
              className="bg-transparent text-xs font-bold tracking-wide uppercase outline-none cursor-pointer w-full md:w-auto"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {label(c)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-gray-50 px-6 py-4 rounded-[2rem] gap-3 w-full md:w-auto">
            <ArrowDownAZ size={18} className="text-blue-600 shrink-0" aria-hidden="true" />
            <label htmlFor="inventory-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="inventory-sort"
              className="bg-transparent text-xs font-bold tracking-wide uppercase outline-none cursor-pointer w-full md:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active filter chip */}
        {category && (
          <div className="mb-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
              Category: {label(category)}
              <button
                type="button"
                onClick={() => setCategory("")}
                className="p-0.5 rounded-full hover:bg-blue-100"
                aria-label="Remove category filter"
              >
                <X size={14} />
              </button>
            </span>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" aria-label="Loading cars">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-red-100">
            <h3 className="text-2xl font-black text-gray-900">Couldn't load cars</h3>
            <p className="text-gray-500 mt-2 font-medium">Please check your connection and try again.</p>
            <button
              type="button"
              onClick={fetchCars}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={toCarCard(car, { showCategory: !category })} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-300" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">No cars match your search</h3>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Clear filters
              </button>
            ) : (
              <p className="text-gray-500 mt-2 font-medium">New listings are added regularly. Check back soon.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default InventoryPage;
