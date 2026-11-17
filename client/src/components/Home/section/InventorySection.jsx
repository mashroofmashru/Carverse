import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
    <section className="py-16 md:py-20 bg-mist border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow mb-3 text-ink">02 — Featured</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Dealer picks
            </h2>
            <p className="mt-4 text-ink/80 text-lg">Top cars available for immediate delivery.</p>
          </div>
          <Link to="/viewInventory" className="btn btn-ink self-start sm:self-auto">
            View all inventory <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading cars">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-mist-deep border border-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-14 bg-white rounded-xl border border-neutral-200 shadow-lg">
            <p className="font-display text-xl font-bold">We couldn't load cars right now.</p>
            <button type="button" onClick={fetchCars} className="btn btn-brand mt-6">
              Try again
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-14 bg-white border-2 border-dashed border-neutral-300">
            <p className="font-display text-xl font-bold">New listings are coming soon</p>
            <p className="mt-2 text-ink/70">Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car._id} car={toCarCard(car)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InventorySection;
