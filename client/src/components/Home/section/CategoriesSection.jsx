import React from 'react';
import CategoryCard from '../CategoryCard';

const categoryData = [
  { img: "https://cdn-icons-png.flaticon.com/512/55/55283.png", alt: "SUV", title: "SUVs" },
  { img: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png", alt: "Sedan", title: "Sedans" },
  { img: "https://cdn-icons-png.flaticon.com/512/5035/5035162.png", alt: "Hatchback", title: "Hatchbacks" },
  { img: "https://cdn-icons-png.flaticon.com/512/2087/2087622.png", alt: "Electric", title: "Electric" },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Find the perfect body type for your lifestyle.</p>
          </div>
          {/* <a href="#" className="text-blue-600 font-semibold hover:underline">View All</a> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryData.map((category) => (
            <CategoryCard 
              key={category.title}
              imgUrl={category.img}
              altText={category.alt}
              title={category.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;