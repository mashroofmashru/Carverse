import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/Home/section/HeroSection';
import CategoriesSection from '../components/Home/section/CategoriesSection';
import InventorySection from '../components/Home/section/InventorySection';
import ServiceCenterBanner from '../components/Home/ServiceCenterBanner';
import Footer from '../components/common/Footer';

function Home() {
  return (
    <div className="bg-white text-ink font-sans antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <InventorySection />
        <ServiceCenterBanner />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
