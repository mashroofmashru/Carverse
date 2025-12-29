import React, { useEffect, useState } from "react";
import CarCard from "../CarCard";
import { useNavigate } from "react-router-dom";
import api from "../../../config/server";

const InventorySection = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get("/featuredproducts");
        console.log(res.data)
        setCars(res.data.cars);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 text-center">
        <p>Loading cars...</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Dealer Inventory
          </h2>
          <p className="text-gray-500 mt-2">
            Top picks available for immediate delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard
              key={car._id}
              car={{
                _id: car._id,
                title: car.title,
                details: `${car.transmission} • ${car.fuelType}`,
                dealer: "Verified Dealer",
                price: `₹${car.price}`,
                imgUrl: `http://localhost:3000${car.images[0]}`,
                tag: "New",
                tagColor: "bg-blue-600",
              }}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition shadow-lg"
            onClick={() => navigate("/viewInventory")}
          >
            View All Inventory
          </button>
        </div>
      </div>
    </section>
  );
};

export default InventorySection;
