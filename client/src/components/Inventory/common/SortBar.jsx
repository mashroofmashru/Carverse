// src/components/common/SortBar.jsx
import React from "react";

const SortBar = ({ totalCount }) => (
  <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-700 hidden sm:block">
      {totalCount} Vehicles found matching your criteria.
    </p>
    <div className="flex items-center space-x-3">
      <label htmlFor="sort" className="text-sm text-gray-700">
        Sort By:
      </label>
      <select
        id="sort"
        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary transition"
      >
        <option>Relevance</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Mileage: Low to High</option>
        <option>Year: Newest</option>
      </select>
    </div>
  </div>
);

export default SortBar;
