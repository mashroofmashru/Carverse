import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ icon, title, to }) => {
  const Icon = icon;
  return (
    <Link
      to={to}
      className="group block bg-gray-50 rounded-2xl p-6 text-center hover:bg-blue-50 transition border border-gray-100 hover:border-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Icon
        className="h-14 w-14 mx-auto mb-4 text-gray-500 group-hover:text-blue-600 transition"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="font-bold text-gray-800">{title}</h3>
    </Link>
  );
};

export default CategoryCard;
