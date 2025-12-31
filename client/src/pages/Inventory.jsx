import React, { useEffect, useState, useMemo } from "react";
import {
  Search, IndianRupee, ArrowDownAZ, LayoutGrid,
  Sparkles, Fuel, Settings2, ArrowUpRight, Gauge, Palette
} from "lucide-react";
import Header from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import api from "../config/server";
import CarCard from "../components/Home/CarCard";

// --- Main Page Component ---
const InventoryPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let isMounted = true;
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await api.get("/getInventory");
        if (isMounted) setCars(res.data.cars || []);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCars();
    return () => { isMounted = false; };
  }, []);

  // Filter & Sort Engine
  const filteredCars = useMemo(() => {
    let result = cars.filter(car => {
      const s = searchTerm.toLowerCase();
      return s === "" ||
        car.title?.toLowerCase().includes(s) ||
        car.brand?.toLowerCase().includes(s) ||
        car.model?.toLowerCase().includes(s);
    });

    if (sortBy === "priceLow") result.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [cars, searchTerm, sortBy]);

  return (
    <div className="bg-[#fcfcfd] font-inter min-h-screen text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Collection</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            Inventory Search
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Analyzing {filteredCars.length} results found across all active dealerships.
          </p>
        </div>

        {/* Integrated Search & Sort Box */}
        <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by Brand, Model, or Keyword..."
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-gray-50 px-8 py-5 rounded-[2rem] gap-4 w-full md:w-auto">
            <ArrowDownAZ size={20} className="text-blue-600" />
            <select
              className="bg-transparent text-[10px] font-black tracking-widest uppercase outline-none cursor-pointer w-full md:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-[500px] bg-gray-100 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCars.map(car => (
              <CarCard
                key={car._id}
                car={{
                  _id: car._id,
                  title: car.title,
                  details: `${car.transmission} • ${car.fuelType}`,
                  dealer: "Verified Dealer",
                  price: `₹${car.price}`,
                  imgUrl: `http://localhost:3000${car.images[0]}`,
                  tagColor: "bg-blue-600",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Machine Not Found</h3>
            <p className="text-gray-400 mt-2 font-medium">Try clearing your search parameters.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default InventoryPage;