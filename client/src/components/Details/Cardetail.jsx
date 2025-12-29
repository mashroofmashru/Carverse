import React, { useState } from 'react';
import { Car, ChevronRight, Gauge, Fuel, Settings2, Droplet, FileCheck, MessageCircle, CalendarDays, Star } from 'lucide-react';
import CarCard from './Carcard';
// --- Data for easy mapping/updates ---
const CAR_DETAILS = {
    title: 'Mercedes-Benz C-Class',
    model: 'C 300 4MATIC Sedan',
    price: '$48,500',
    specs: [
        { icon: CalendarDays, label: 'Year', value: '2025' },
        { icon: Gauge, label: 'Mileage', value: '12,450 mi' },
        { icon: Fuel, label: 'Fuel Type', value: 'Hybrid' },
        { icon: Settings2, label: 'Transmission', value: 'Automatic' },
        { icon: Droplet, label: 'Color', value: 'Polar White' },
        { icon: FileCheck, label: 'History', value: 'Clean Title' },
    ],
    thumbnails: [
        { id: 1, src: 'https://images.unsplash.com/photo-1669451702444-39c51b44e9ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Front Exterior View' },
        { id: 2, src: 'https://images.unsplash.com/photo-1686562483617-3cf08d81e117?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Rear View' },
        { id: 3, src: 'https://images.unsplash.com/photo-1664626670384-21fad2ee8610?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Interior Dashboard' },
        { id: 4, src: 'https://images.unsplash.com/photo-1636451824546-b7d4cc162446?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Wheel/Detail View' },
    ],
};


const CarDetailPage = () => {
    const [mainImage, setMainImage] = useState(CAR_DETAILS.thumbnails[0].src);
    const [activeThumbnailId, setActiveThumbnailId] = useState(CAR_DETAILS.thumbnails[0].id);

    const changeImage = (newSrc, id) => {
        const newOptimizedSrc = newSrc.replace(/&w=\d+&/g, '&w=1200&');
        setMainImage(newOptimizedSrc);
        setActiveThumbnailId(id);
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <a href="index.html" className="hover:text-primary">Home</a>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <a href="#" className="hover:text-primary">Used Inventory</a>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <a href="#" className="hover:text-primary">Mercedes-Benz</a>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-semibold text-gray-900">C-Class</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-10">

                    <div className="w-full lg:w-2/3">

                        <div className="lg:hidden mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{CAR_DETAILS.title}</h1>
                            <p className="text-gray-500 mt-1">{CAR_DETAILS.model}</p>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8">
                            {/* Main Image */}
                            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-100 mb-2 group">
                                <img
                                    src={mainImage}
                                    alt={CAR_DETAILS.thumbnails.find(t => t.id === activeThumbnailId)?.alt || 'Car Exterior'}
                                    className="w-full h-full object-cover transition duration-500"
                                />
                                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                    Verified Dealer
                                </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {CAR_DETAILS.thumbnails.map((thumb) => (
                                    <button
                                        key={thumb.id}
                                        onClick={() => changeImage(thumb.src, thumb.id)}
                                        className={`h-24 rounded-lg overflow-hidden border-2 transition hover:opacity-100 focus:outline-none ${thumb.id === activeThumbnailId
                                            ? 'border-primary opacity-100'
                                            : 'border-transparent opacity-60'
                                            }`}
                                    >
                                        <img src={thumb.src} className="w-full h-full object-cover" alt={thumb.alt} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Specs Grid (Using .map for repetition) */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Specifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                                {CAR_DETAILS.specs.map((spec) => (
                                    <div key={spec.label} className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-primary">
                                            <spec.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">{spec.label}</p>
                                            <p className="font-medium">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Seller's Description</h2>
                            <div className="prose text-gray-600 leading-relaxed">
                                <p className="mb-4">
                                    Experience the perfect blend of luxury and performance with this pristine 2024
                                    Mercedes-Benz C-Class. This vehicle has been meticulously maintained by a single owner and
                                    comes fully loaded with the Premium Package.
                                </p>
                                <p className="mb-4">Key features include:</p>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li>11.9-inch central touchscreen multimedia display</li>
                                    <li>64-color ambient lighting</li>
                                    <li>Blind Spot Assist with Exit Warning Assist</li>
                                    <li>Burmester 3D Surround Sound System</li>
                                </ul>
                                <p>Passed our rigorous 150-point inspection. Manufacturer warranty valid until 2028.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar (33%) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 space-y-6">

                            {/* Price Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                                <div className="hidden lg:block mb-4">
                                    <h1 className="text-2xl font-bold text-gray-900">{CAR_DETAILS.title}</h1>
                                    <p className="text-gray-500 text-sm">{CAR_DETAILS.model}</p>
                                </div>

                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                        <span className="text-4xl font-bold text-primary">{CAR_DETAILS.price}</span>
                                    </div>
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                                        Great Price
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex justify-center items-center gap-2">
                                        <MessageCircle className="w-5 h-5" /> Contact Dealer
                                    </button>
                                    <button className="w-full py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-primary hover:text-primary transition flex justify-center items-center gap-2">
                                        <CalendarDays className="w-5 h-5" /> Schedule Test Drive
                                    </button>
                                </div>
                            </div>

                            {/* Dealer Info */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Sold By</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <img src="https://plus.unsplash.com/premium_photo-1710672205278-9a24775844be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Dealer Agent"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Silver Star Dealers</h4>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span>4.9 (500+ Reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <form className="space-y-3">
                                    <input type="text" placeholder="Full Name" aria-label="Full Name" required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                    <input type="email" placeholder="Email Address" aria-label="Email Address" required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                    <input type="tel" placeholder="Phone Number" aria-label="Phone Number"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                    <textarea rows="3" placeholder="I am interested in this vehicle..." aria-label="Message"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"></textarea>
                                    <button type="submit"
                                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition text-sm">
                                        Send Message
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CarDetailPage;