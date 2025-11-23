import React from 'react';

const CarCard = ({ car }) => {
  const { title, details, dealer, price, imgUrl, tag, tagColor } = car;

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 cursor-pointer" 
      onClick={() => window.location.href='/user/details.html'}
    >
      <div className="relative h-56 bg-gray-200">
        {tag && (
          <span className={`absolute top-4 left-4 ${tagColor} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}>
            {tag}
          </span>
        )}
        <img src={imgUrl} alt={title} className="w-full h-full object-cover"/>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{details}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <i className="fa-solid fa-store text-primary"></i>
          <span>Sold by: <strong>{dealer}</strong></span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;