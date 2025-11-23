import React from 'react';

const ServiceCenterBanner = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-blue-600 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-10 md:p-16 text-white flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nearest Service Center</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Keep your car in top condition. Find authorized workshops and dealerships near you for scheduled maintenance.
            </p>
            
            <div className="relative max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fa-solid fa-location-dot text-gray-400"></i>
              </div>
              <input 
                type="text" 
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter Zip Code or City"
              />
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-4">
                {/* User Avatars (replace with actual logic/props if needed) */}
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-bold overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-bold overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="User" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-bold overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="User" />
                </div>
              </div>
              <span className="text-sm font-medium">Over 500+ certified mechanics ready</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative min-h-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Service Center" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCenterBanner;