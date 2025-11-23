// src/components/vehicles/VehicleCard.jsx
import React from "react";

const VehicleCard = ({ vehicle }) => {
  const { title, miles, transmission, price, image, featured } = vehicle;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {featured && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
            FEATURED
          </span>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-500 text-sm">
          {miles} miles | {transmission}
        </p>
        <p className="text-3xl font-extrabold text-primary mt-3 mb-4">
          ${price.toLocaleString()}
        </p>
        <a
          href="/details"
          className="block w-full text-center py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default VehicleCard;
