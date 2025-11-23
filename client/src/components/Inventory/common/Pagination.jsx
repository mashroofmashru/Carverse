// src/components/common/Pagination.jsx
import React from "react";

const Pagination = () => (
  <div className="mt-10 flex justify-center">
    <div className="flex space-x-2">
      <button className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        Previous
      </button>
      <button className="px-4 py-2 text-white bg-primary border border-primary rounded-lg">
        1
      </button>
      <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        2
      </button>
      <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        3
      </button>
      <button className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        Next
      </button>
    </div>
  </div>
);

export default Pagination;
