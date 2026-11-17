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
    <div className="bg-mist min-h-screen text-ink flex flex-col">
      <Navbar />

      {/* Page header band */}
      <header data-surface="ink" className="bg-night text-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="eyebrow text-brand mb-3">Inventory</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            {category ? `${label(category)} inventory` : "Find your car"}
          </h1>
          <p className="mt-4 text-lg text-white/90" aria-live="polite">
            {loading ? "Loading cars…" : `${filteredCars.length} ${filteredCars.length === 1 ? "car" : "cars"} available`}
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search, category and sort */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-lg mb-8 flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60 pointer-events-none"
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
              className="field pl-12 h-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:w-56">
            <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink pointer-events-none" aria-hidden="true" />
            <label htmlFor="inventory-category" className="sr-only">
              Category
            </label>
            <select
              id="inventory-category"
              className="field pl-11 font-semibold cursor-pointer h-full"
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

          <div className="relative md:w-60">
            <ArrowDownAZ size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink pointer-events-none" aria-hidden="true" />
            <label htmlFor="inventory-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="inventory-sort"
              className="field pl-11 font-semibold cursor-pointer h-full"
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
          <div className="mb-8 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 pl-4 pr-2 py-1.5 bg-brand text-ink rounded-xl border border-neutral-200 text-sm font-bold">
              Category: {label(category)}
              <button
                type="button"
                onClick={() => setCategory("")}
                className="p-1 hover:bg-ink hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
                aria-label="Remove category filter"
              >
                <X size={16} />
              </button>
            </span>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading cars">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-mist-deep border border-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-neutral-200 shadow-lg">
            <h3 className="font-display text-2xl font-bold">Couldn't load cars</h3>
            <p className="text-ink/70 mt-2">Please check your connection and try again.</p>
            <button type="button" onClick={fetchCars} className="btn btn-brand mt-6">
              Try again
            </button>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={toCarCard(car, { showCategory: !category })} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border-2 border-dashed border-neutral-300">
            <div className="w-20 h-20 bg-mist-deep rounded-xl border border-neutral-200 flex items-center justify-center mx-auto mb-6">
              <Search size={36} className="text-ink" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold">No cars match your search</h3>
            {hasFilters ? (
              <button type="button" onClick={clearFilters} className="btn btn-brand mt-6">
                Clear filters
              </button>
            ) : (
              <p className="text-ink/70 mt-2">New listings are added regularly. Check back soon.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default InventoryPage;
