// src/components/vehicles/VehicleGrid.jsx
import React from "react";
import VehicleCard from "./VehicleCard";

const VehicleGrid = ({ vehicles }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {vehicles.map((car,index) => (
      <VehicleCard key={index} vehicle={{
                _id: car._id,
                title: car.title,
                transmission: `${car.transmission}`,
                fuelType:`${car.fuelType}`,
                dealer: "Verified Dealer",
                price: `₹${car.price}`,
                images: `http://localhost:3000${car.images[0]}`
              }} />
    ))}
  </div>
);

export default VehicleGrid;
