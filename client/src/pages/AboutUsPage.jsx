import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
const AboutUsPage = () => {
  return (
    <>
      <style>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .text-primary { color: #2563eb; }
        .bg-primary { background-color: #2563eb; }
        .hover\\:bg-primary-dark:hover { background-color: #1d4ed8; }
      `}</style>

      <div className="bg-gray-50 font-inter min-h-screen flex flex-col">
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Redefining the <span className="text-primary">Car Buying</span> Experience
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Founded in 2010, AutoNext began with a simple mission: to make finding your next vehicle 
                as transparent, enjoyable, and efficient as possible. Today, we are one of the region's 
                most trusted names in automotive excellence.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 text-center">
              {[
                { label: "Vehicles Sold", value: "15k+" },
                { label: "Happy Clients", value: "12k+" },
                { label: "Service Centers", value: "8" },
                { label: "Years Experience", value: "15" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* About Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Our Story & Values */}
              <div className="lg:col-span-2 space-y-10">
                <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    What started as a small local lot has grown into a premier digital and physical 
                    automotive destination. We recognized early on that the traditional dealership 
                    model was broken—filled with hidden fees and high-pressure tactics. 
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    AutoNext was built on the foundation of Integrity First. We leverage technology 
                    to provide real-time pricing and deep vehicle history, ensuring you have all the 
                    facts before you ever step foot on our lot.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-primary">
                    <h3 className="font-bold text-gray-900 mb-2">Our Vision</h3>
                    <p className="text-sm text-gray-600">To be the world’s most consumer-centric automotive platform where buyers feel empowered and excited.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-primary">
                    <h3 className="font-bold text-gray-900 mb-2">Our Commitment</h3>
                    <p className="text-sm text-gray-600">Every vehicle undergoes a 150-point inspection, ensuring safety and quality that lasts for miles.</p>
                  </div>
                </div>
              </div>

              {/* Sidebar: Leadership/Contact Placeholder */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Leadership
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { name: "Jaideep", role: "Founder & CEO" },
                      { name: "Arshith", role: "Founder & CTO" },
                      { name: "Mirzab", role: "Head of Operations"}
                    ].map((member, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0">
                           <img src={`https://xsgames.co/randomusers/assets/avatars/male/${i + 1}.jpg`} alt={member.name} className="rounded-full" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{member.name}</div>
                          <div className="text-xs text-primary font-semibold uppercase">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    </>
  );
};

export default AboutUsPage;