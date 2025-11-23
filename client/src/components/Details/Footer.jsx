import React from 'react';
import { Car } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Car className="text-primary" />
                    <span className="text-xl font-bold">CarVerse</span>
                </div>
                <p className="text-gray-400 text-sm">&copy; 2025 CarVerse. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;