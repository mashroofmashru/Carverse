import React from 'react';

const HeroSection = () => {
  return (
    <header className="relative bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6 py-6 md:py-24 flex flex-col-reverse md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Buy cars directly from <span className="text-blue-600">verified dealers.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Skip the middleman. Browse thousands of certified vehicles, compare dealer prices, and book a test drive instantly.
          </p>
        </div>
        
        <div className="w-full md:w-1/2 relative">
          <div className="relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Hero Car" 
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;