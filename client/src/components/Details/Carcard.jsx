import React from 'react';

/**
 * Reusable component for displaying a single vehicle card.
 * @param {object} car - The car data object { name, model, price, src }
 */
const CarCard = ({ car }) => {
    return (
        <div key={car.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            {/* Image Container with Hover Effect */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                    src={car.src}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    alt={`${car.name} ${car.model}`} 
                />
            </div>
            
            {/* Details and Price */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900">{car.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{car.model}</p>
                
                <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">{car.price}</span>
                    <button className="text-sm font-medium text-gray-500 hover:text-primary transition">
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarCard;