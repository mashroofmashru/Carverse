import React from "react";
import { Car, CarFront, CarTaxiFront, Zap } from "lucide-react";
import CategoryCard from "../CategoryCard";

// `value` must match the category stored on cars (see AddCarForm / car schema)
const categoryData = [
  { icon: CarFront, title: "SUVs", value: "SUVs" },
  { icon: Car, title: "Sedans", value: "SEDAN" },
  { icon: CarTaxiFront, title: "Hatchbacks", value: "HATCHBACK" },
  { icon: Zap, title: "Electric", value: "ELECTRIC" },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-500 mt-2">Find the perfect body type for your lifestyle.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryData.map((category) => (
            <CategoryCard
              key={category.value}
              icon={category.icon}
              title={category.title}
              to={`/viewInventory?category=${encodeURIComponent(category.value)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
