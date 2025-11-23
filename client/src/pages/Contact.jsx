import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
const ContactPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity()) {
      const formData = new FormData(form);
      console.log("Form data submitted:");
      console.log("Name:", formData.get("name"));
      console.log("Email:", formData.get("email"));
      console.log("Inquiry:", formData.get("inquiry"));

      setShowSuccess(true);
      form.reset();
    } else {
      console.error("Form validation failed.");
    }
  };

  return (
    <>
      {/* You can move this into your global CSS if you want */}
      <style>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .text-primary { color: #2563eb; }
        .bg-primary { background-color: #2563eb; }
        .hover\\:bg-primary-dark:hover { background-color: #1d4ed8; }
        .focus\\:ring-primary:focus { --tw-ring-color: #2563eb; }
        .focus\\:border-primary:focus { border-color: #2563eb; }
      `}</style>

      <div className="bg-gray-50 font-inter min-h-screen flex flex-col">
        <Navbar/>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Get In Touch
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whether you have questions about a vehicle, need financing
                assistance, or want to schedule a test drive, our team is here
                to help.
              </p>
            </div>

            {/* Contact Form and Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Contact Form */}
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <form id="contact-form" className="space-y-4" onSubmit={handleSubmit}>
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="john.doe@example.com"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(555) 123-4567"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                  </div>

                  {/* Subject / Inquiry Type */}
                  <div>
                    <label
                      htmlFor="inquiry"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject of Inquiry
                    </label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      required
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition bg-white"
                    >
                      <option value="">Select a reason...</option>
                      <option value="test-drive">Schedule a Test Drive</option>
                      <option value="financing">Financing Questions</option>
                      <option value="inventory">
                        Vehicle Availability / Details
                      </option>
                      <option value="general">General Question</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      required
                      placeholder="Tell us how we can help you."
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 border border-transparent shadow-md text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark transition duration-200"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </form>
              </div>

              {/* Dealership Details */}
              <div className="lg:col-span-1 space-y-8">
                {/* Information Card */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m10.606 0a9 9 0 11-12.728 0M10 13a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                    Our Dealership
                  </h3>

                  <div className="space-y-4 text-gray-700">
                    <p className="flex items-start">
                      <svg
                        className="w-5 h-5 mt-1 mr-3 text-primary/80 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <strong className="font-medium">Hours:</strong>&nbsp;Mon -
                      Sat, 9:00 AM - 7:00 PM
                    </p>
                    <p className="flex items-start">
                      <svg
                        className="w-5 h-5 mt-1 mr-3 text-primary/80 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <strong className="font-medium">Phone:</strong>&nbsp;987654321
                    </p>
                    <p className="flex items-start">
                      <svg
                        className="w-5 h-5 mt-1 mr-3 text-primary/80 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v4m-2 4h-4a2 2 0 01-2-2v-4m-6 4v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m0-4h18m-4 0v-4m-2 4V7a2 2 0 00-2-2H9a2 2 0 00-2 2v3"
                        />
                      </svg>
                      <strong className="font-medium">Email:</strong>
                      &nbsp;info@carverse.com
                    </p>
                    <p className="flex items-start">
                      <svg
                        className="w-5 h-5 mt-1 mr-3 text-primary/80 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m10.606 0a9 9 0 11-12.728 0M12 10a1 1 0 100-2 1 1 0 000 2z"
                        />
                      </svg>
                      <strong className="font-medium">Address:</strong>
                      &nbsp;123 Main Street,AB1234
                    </p>
                  </div>
                </div>

                {/* Map placeholder (kept hidden) */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hidden">
                  <h3 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-100">
                    Find Us
                  </h3>
                  <img
                    src="https://placehold.co/600x300/e0e7ff/1e40af?text=Dealership+Location+Map"
                    alt="Map Location Placeholder"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
                  <svg
                    className="w-12 h-12 text-green-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We will get back to you within
                    one business day.
                  </p>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h5 className="font-bold mb-3 text-primary">COMPANY</h5>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold mb-3 text-primary">LEGAL</h5>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold mb-3 text-primary">CONTACT US</h5>
                <ul className="space-y-2 text-gray-300">
                  <li>(555) 123-4567</li>
                  <li>info@CarVerse.com</li>
                  <li>123 Main St, USA</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
              &copy; 2025 CarVerse. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ContactPage;
