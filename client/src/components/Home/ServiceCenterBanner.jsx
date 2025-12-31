import React, { useState } from 'react';
import { MapPin, Search, Loader2, Star, Navigation, Phone } from 'lucide-react';
import api from '../../config/server';

const ServiceCenterBanner = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && query.trim() !== "") {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await api.get(`/service-centers/search?locationName=${query}`);
        setResults(res.data.centers);
      } catch (err) {
        console.error("Search Error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="font-inter">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

            <div className="w-full md:w-1/2 p-10 md:p-16 text-white flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nearest Service Center</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Find authorized workshops and dealerships near you for scheduled maintenance.
              </p>

              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  {loading ? <Loader2 className="text-blue-600 animate-spin" size={18} /> : <MapPin className="text-gray-400" size={18} />}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="block w-full p-4 pl-12 text-sm text-gray-900 rounded-2xl bg-white outline-none"
                  placeholder="Enter City"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 relative min-h-[300px]">
              <img src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=1332" alt="Service" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          {hasSearched && (
            <div className="mt-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((center, index) => {
                  console.log(center)
                    const handleGetDirections = () => {
                      const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`;
                      window.open(mapUrl, '_blank');
                    };
                    return (
                      <div
                        key={center.id || index}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>

                          <div className="flex justify-between items-start mb-6">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${center.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {center.isOpen ? '● Open Now' : '○ Closed'}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl text-gray-700 font-bold text-xs border border-gray-100">
                              <Star size={14} className="text-yellow-500" fill="currentColor" />
                              {center.rating} <span className="text-gray-400 font-normal">({center.reviews})</span>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {center.name}
                            </h4>
                            <div className="flex items-start gap-2 text-gray-500">
                              <MapPin size={16} className="mt-1 flex-shrink-0 text-blue-500" />
                              <p className="text-sm leading-relaxed line-clamp-2">{center.address}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`, '_blank')}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                          >
                            <Navigation size={16} />
                            Directions
                          </button>

                          <a
                            href={`tel:${center.phone || '#'}`}
                            className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <Phone size={18} />
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : !loading && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No service centers found in this location. Try a different city.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServiceCenterBanner;