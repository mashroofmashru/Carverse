import React from "react";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const { _id, title, details, dealer, price, imgUrl, tag, tagColor } = car;
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/details/${_id}`)}
    >
      <div className="relative h-56 bg-gray-200">
        {tag && (
          <span
            className={`absolute top-4 left-4 ${tagColor} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}
          >
            {tag}
          </span>
        )}
        <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{details}</p>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <span>
            Sold by: <strong>{dealer}</strong>
          </span>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <span className="text-2xl font-bold text-gray-900">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
