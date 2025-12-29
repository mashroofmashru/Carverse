import React from "react";
import { useNavigate } from "react-router-dom";

const VehicleCard = ({ vehicle }) => {
  const {_id, title, transmission,fuelType, price, images} = vehicle;
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/details/${_id}`)} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img src={images} alt={title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-500 text-sm">
          {fuelType} | {transmission}
        </p>
        <p className="text-3xl font-extrabold text-primary mt-3 mb-4">
          ${price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;
