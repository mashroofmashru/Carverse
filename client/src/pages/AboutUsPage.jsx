import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../config/server";
import Toast from "../components/common/Toast";
import { Send, Mail, User, MessageCircle, Search, ShoppingBag, HelpCircle, LifeBuoy, Check, ArrowRight } from "lucide-react";

const steps = [
  { icon: Search, title: "Search cars", text: "Browse available cars using filters, images, and detailed listings." },
  { icon: ShoppingBag, title: "Order cars", text: "Choose your car and place an order with transparent pricing." },
  { icon: HelpCircle, title: "Submit an enquiry", text: "Have questions or doubts? Fill out the enquiry form for assistance." },
  { icon: LifeBuoy, title: "Contact support", text: "Facing any issues? Reach out through the contact form for quick help." },
];

const team = [
  { name: "Jaideep", role: "Founder & CEO" },
  { name: "Arshith", role: "Founder & CTO" },
  { name: "Mirzab", role: "Head of Operations" },
];

const promises = ["7-Day Money Back Guarantee", "No Hidden Fees, Ever", "Free Home Delivery", "24/7 Roadside Assistance"];

const AboutUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const location = useLocation();

  // Scroll to #contact-us when arriving from the footer link
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

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
      setToast({ show: true, message: error.response?.data?.message || "Failed to send message. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mist text-ink min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <p className="eyebrow mb-5">About Carverse · Since 2010</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
              Redefining the{" "}
              <span className="inline-block bg-brand px-3 rounded-lg">car buying</span> experience
            </h1>
            <p className="mt-8 text-lg text-ink/80 max-w-2xl leading-relaxed">
              Founded in 2010, Carverse began with a simple mission: to make finding your next vehicle as transparent,
              enjoyable, and efficient as possible. Today, we are one of the region's most trusted names in automotive
              excellence.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/viewInventory" className="btn btn-brand">
                Browse inventory <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="#contact-us" className="btn btn-light">
                Get in touch
              </a>
            </div>
          </div>
        </section>

        {/* Story, vision, commitment */}
        <section data-surface="ink" className="bg-night text-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="eyebrow text-brand mb-3">01 — Our story</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                From local lot to digital ecosystem
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-lg leading-relaxed text-white/95">
              <p>
                What began as a small local dealership has grown into a fully connected digital and physical automotive
                ecosystem. Recognizing the inefficiencies and lack of transparency in the traditional car buying model,
                we rebuilt the experience from the ground up.
              </p>
              <p>
                Carverse is founded on technology and trust, offering real time inventory updates, secure digital
                payments, and integrated service history so you have complete transparency and control before ever
                stepping onto our lot.
              </p>
            </div>

            <div className="lg:col-span-12 grid md:grid-cols-2 gap-6">
              {[
                { title: "Our vision", text: "To be the world’s most consumer-centric automotive platform where buyers feel empowered and excited." },
                { title: "Our commitment", text: "Every vehicle undergoes a 150-point inspection, ensuring safety and quality that lasts for miles." },
              ].map((item) => (
                <div key={item.title} className="bg-mist text-ink rounded-xl border border-neutral-200 p-6 shadow-sm">
                  <h3 className="font-display text-xl font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-ink/80 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-mist border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <p className="eyebrow mb-3">02 — How it works</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-12">
              Four steps to your next car
            </h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ icon, title, text }, i) => {
                const Icon = icon;
                return (
                  <li key={title} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-display text-4xl font-bold text-ink">0{i + 1}</span>
                      <Icon size={26} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm text-ink/75 leading-relaxed">{text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Team + promises */}
        <section data-surface="ink" className="bg-night text-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid lg:grid-cols-2 gap-10">
            <div>
              <p className="eyebrow text-brand mb-3">03 — Leadership</p>
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight mb-8">The team</h2>
              <ul className="space-y-4">
                {team.map((member) => (
                  <li key={member.name} className="flex items-center gap-4 bg-mist text-ink rounded-xl border border-neutral-200 p-4 shadow-sm">
                    <span
                      className="h-12 w-12 shrink-0 flex items-center justify-center bg-brand rounded-xl border border-neutral-200 font-display text-xl font-bold"
                      aria-hidden="true"
                    >
                      {member.name[0]}
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold leading-tight">{member.name}</p>
                      <p className="eyebrow">{member.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-brand mb-3">04 — Why choose us</p>
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight mb-8">Our promises</h2>
              <ul className="space-y-4">
                {promises.map((item) => (
                  <li key={item} className="flex items-center gap-4 border-2 border-white/40 p-4">
                    <span className="h-8 w-8 shrink-0 flex items-center justify-center bg-brand text-ink rounded-xl border border-neutral-200" aria-hidden="true">
                      <Check size={18} strokeWidth={3} />
                    </span>
                    <span className="font-display text-lg font-bold tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <p className="eyebrow mb-3">05 — Contact</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8 flex items-center gap-3">
              <Send className="text-ink shrink-0" size={32} aria-hidden="true" /> Get in touch
            </h2>

            <form id="contact-us" onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 shadow-lg p-6 sm:p-8 space-y-6 scroll-mt-28">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="label">Full name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/60" size={18} aria-hidden="true" />
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="field pl-11"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/60" size={18} aria-hidden="true" />
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="field pl-11"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="label">Subject</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/60" size={18} aria-hidden="true" />
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="field pl-11"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="field resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn btn-brand w-full sm:w-auto">
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </section>
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
  );
};

export default AboutUsPage;
