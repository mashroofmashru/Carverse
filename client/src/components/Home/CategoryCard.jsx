import React from 'react';

const CategoryCard = ({ imgUrl, altText, title }) => {
  return (
    <div className="group cursor-pointer">
      <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-blue-50 transition border border-gray-100 hover:border-blue-200">
        <img 
          src={imgUrl} 
          className="h-16 mx-auto mb-4 opacity-70 group-hover:opacity-100 transition" 
          alt={altText}
        />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;