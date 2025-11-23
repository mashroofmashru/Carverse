import React from 'react';
import CarCard from '../CarCard';

const featuredCars = [
  {
    title: 'Mercedes-Benz C-Class',
    details: 'Automatic • Hybrid',
    dealer: 'Silver Star Dealers',
    price: '$48,500',
    imgUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    tag: 'Verified Dealer',
    tagColor: 'bg-blue-600',
  },
  {
    title: 'Toyota RAV4 XLE',
    details: 'AWD • Petrol',
    dealer: 'City Toyota Hub',
    price: '$32,100',
    imgUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    tag: 'Best Seller',
    tagColor: 'bg-green-600',
  },
  {
    title: 'Tesla Model 3',
    details: 'Electric • Long Range',
    dealer: 'EV Direct',
    price: '$41,990',
    imgUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    tag: null,
    tagColor: null,
  },
];

const InventorySection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Dealer Inventory</h2>
          <p className="text-gray-500 mt-2">Top picks available for immediate delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button 
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition shadow-lg" 
            onClick={() => window.location.href='/user/viewallinventory.html'}
          >
            View All Inventory
          </button>
        </div>
      </div>
    </section>
  );
};

export default InventorySection;