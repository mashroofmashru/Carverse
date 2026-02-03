import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import api from "../config/server";
import Toast from "../components/common/Toast";
import { Send, Mail, User, MessageCircle } from "lucide-react";

const AboutUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", formData);
      setToast({ show: true, message: "Message sent successfully!", type: "success" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setToast({ show: true, message: "Failed to send message. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
                    What began as a small local dealership has grown into a fully connected digital and physical automotive ecosystem. Recognizing the inefficiencies and lack of transparency in the traditional car buying model, we rebuilt the experience from the ground up.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    AutoNext is founded on technology and trust, offering real time inventory updates, secure digital payments, and integrated service history so you have complete transparency and control before ever stepping onto our lot.
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

                {/* Contact Section */}
                <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Send className="text-primary" size={24} /> Get in Touch
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </section>
              </div>

              {/* Sidebar: Leadership/Contact Placeholder */}
              <div className="lg:col-span-1 space-y-8">
                {/* Leadership Section */}
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
                      { name: "Mirzab", role: "Head of Operations" }
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

                {/* Why Choose Us Section */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-xl text-white">
                  <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                    <span className="bg-white/20 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Why Choose Us
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "7-Day Money Back Guarantee",
                      "No Hidden Fees, Ever",
                      "Free Home Delivery",
                      "24/7 Roadside Assistance"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3 mt-1 text-blue-300">•</span>
                        <span className="font-medium text-primary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Awards Section */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Awards & Recognition
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="bg-amber-100 text-amber-600 p-2 rounded-lg font-bold">2024</div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Best Auto Dealer</div>
                        <div className="text-xs text-gray-500">Consumer Choice Awards</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="bg-gray-200 text-gray-600 p-2 rounded-lg font-bold">2023</div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Top Digital Experience</div>
                        <div className="text-xs text-gray-500">AutoTech Summit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <Toast
          isOpen={toast.show}
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    </>
  );
};

export default AboutUsPage;