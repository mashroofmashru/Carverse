// src/components/vehicles/VehicleGrid.jsx
import React from "react";
import VehicleCard from "./VehicleCard";

const VehicleGrid = ({ vehicles }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {vehicles.map((v) => (
      <VehicleCard key={v.id} vehicle={v} />
    ))}
  </div>
);

export default VehicleGrid;
