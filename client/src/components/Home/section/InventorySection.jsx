import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarCard from "../CarCard";
import api from "../../../config/server";
import { toCarCard } from "../../../utils/car";

const InventorySection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/featuredproducts");
      setCars((res.data.cars || []).filter((car) => car.status !== "SOLD"));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Dealer Inventory</h2>
          <p className="text-gray-500 mt-2">Top picks available for immediate delivery.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading cars">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-600 font-medium">We couldn't load cars right now.</p>
            <button
              type="button"
              onClick={fetchCars}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-600 font-medium">New listings are coming soon. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car._id} car={toCarCard(car)} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/viewInventory"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition shadow-lg"
          >
            View All Inventory
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InventorySection;
