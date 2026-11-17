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
    <section data-surface="ink" className="py-16 md:py-20 bg-night text-white border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <p className="eyebrow mb-3 text-white">01 — Categories</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Browse by body type
          </h2>
          <p className="mt-4 text-white/90 text-lg">Find the perfect fit for your lifestyle.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
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
