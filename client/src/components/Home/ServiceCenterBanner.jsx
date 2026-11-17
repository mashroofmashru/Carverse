import React, { useState } from "react";
import { MapPin, Search, Loader2, Star, Navigation, Phone } from "lucide-react";
import api from "../../config/server";

const directionsUrl = (center) =>
  `https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`;

const ServiceCenterBanner = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const locationName = query.trim();
    if (!locationName) return;

    setLoading(true);
    setHasSearched(true);
    setError(false);
    try {
      const res = await api.get("/service-centers/search", { params: { locationName } });
      setResults(res.data.centers || []);
    } catch (err) {
      console.error("Search Error:", err);
      setResults([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-surface="ink" className="py-16 md:py-20 bg-night text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <p className="eyebrow mb-3 text-white">03 — Service</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Nearest service center
            </h2>
            <p className="mt-5 text-white/90 text-lg max-w-md">
              Find authorized workshops and dealerships near you for scheduled maintenance.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg" role="search">
              <div className="relative flex-1">
                <MapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60 pointer-events-none"
                  size={18}
                  aria-hidden="true"
                />
                <label htmlFor="service-city" className="sr-only">
                  City
                </label>
                <input
                  id="service-city"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="field pl-11 h-full"
                  placeholder="Enter city"
                />
              </div>
              <button type="submit" disabled={loading || !query.trim()} className="btn btn-ink">
                {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
                Search
              </button>
            </form>
          </div>

          <div className="md:col-span-6 relative">
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-brand rounded-xl border border-neutral-200" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=1332"
              alt="Mechanic servicing a car engine"
              loading="lazy"
              className="relative w-full aspect-[4/3] object-cover rounded-xl border border-neutral-200"
            />
          </div>
        </div>

        {hasSearched && !loading && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500" aria-live="polite">
            {error ? (
              <div className="text-center py-12 bg-mist text-ink rounded-xl border border-neutral-200 shadow-lg">
                <p className="font-display text-lg font-bold">Search failed. Please try again in a moment.</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-ink">
                {results.map((center, index) => (
                  <div
                    key={center.id || index}
                    className="bg-mist p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-5 gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            center.isOpen ? "bg-brand text-ink" : "bg-neutral-200 text-ink"
                          }`}
                        >
                          {center.isOpen ? "Open now" : "Closed"}
                        </span>
                        {center.rating != null && (
                          <span className="flex items-center gap-1.5 text-xs font-bold">
                            <Star size={14} className="text-brand-dark" fill="currentColor" aria-hidden="true" />
                            {center.rating} <span className="font-normal text-ink/70">({center.reviews})</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-lg font-bold leading-tight line-clamp-1">{center.name}</h4>
                      <div className="mt-2 flex items-start gap-2 text-ink/80">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
                        <p className="text-sm leading-relaxed line-clamp-2">{center.address}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <a
                        href={directionsUrl(center)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-brand flex-1"
                      >
                        <Navigation size={16} aria-hidden="true" />
                        Directions
                      </a>

                      {center.phone && (
                        <a href={`tel:${center.phone}`} aria-label={`Call ${center.name}`} className="btn btn-light px-3">
                          <Phone size={18} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-white/30">
                <p className="font-medium">No service centers found in this location. Try a different city.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceCenterBanner;
