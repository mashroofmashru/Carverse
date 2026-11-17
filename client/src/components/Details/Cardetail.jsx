import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import useModal from "../../hooks/useModal";
import {
  Gauge,
  Fuel,
  Settings2,
  Droplet,
  FileCheck,
  CalendarDays,
  Tag,
  CreditCard,
  Smartphone,
  ArrowLeft,
  BadgeCheck,
  X,
} from "lucide-react";
import api from "../../config/server";
import { getImageUrl } from "../../config/imageUrl";
import { formatINR, label } from "../../utils/format";

const CarDetailPage = ({ car }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const images = (car.images || []).map((img, index) => ({
    id: index,
    src: getImageUrl(img),
  }));

  const [activeImage, setActiveImage] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [name, setName] = useState(user?.Name || "");
  const [email, setEmail] = useState(user?.Email || "");
  const [phone, setPhone] = useState(user?.Phone || "");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const mainImage = images[activeImage]?.src || images[0]?.src;
  const goToLogin = () => navigate("/login", { state: { from: location.pathname } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/enquiry", {
        carId: car._id,
        dealerId: car.dealerId?._id,
        name,
        email,
        phone,
        message: message.trim() || `I am interested in this ${car.brand} ${car.model}`,
      });
      showToast("Message sent to the dealer!");
      setMessage("");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to send your message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      showToast("Please log in to buy this car.", "error");
      goToLogin();
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 md:py-10">
      <Link
        to="/viewInventory"
        className="inline-flex items-center gap-2 text-sm font-bold hover:text-ink/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to inventory
      </Link>

      <div className="mt-5 mb-8">
        <p className="eyebrow mb-2">
          {[label(car.category), car.year].filter(Boolean).join(" · ")}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          {car.brand} {car.model}
        </h1>
        <p className="mt-3 text-lg text-ink/70">{car.title}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-lg mb-10">
            <div className="aspect-video overflow-hidden bg-mist-deep">
              {mainImage && <img src={mainImage} alt={car.title} className="w-full h-full object-cover" />}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((img, index) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show photo ${index + 1} of ${images.length}`}
                    aria-pressed={index === activeImage}
                    className={`h-16 sm:h-24 border-2 overflow-hidden focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      index === activeImage ? "border-ink ring-2 ring-brand" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <section data-surface="ink" className="bg-night text-white rounded-xl border border-neutral-200 p-6 sm:p-8 mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Vehicle specifications</h2>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Spec icon={CalendarDays} label="Year" value={car.year} />
              <Spec icon={Gauge} label="Mileage" value={`${Number(car.mileage).toLocaleString("en-IN")} km`} />
              <Spec icon={Fuel} label="Fuel" value={label(car.fuelType)} />
              <Spec icon={Settings2} label="Transmission" value={label(car.transmission)} />
              <Spec icon={Tag} label="Category" value={label(car.category)} />
              <Spec icon={Droplet} label="Color" value={car.color} />
              <Spec icon={FileCheck} label="Status" value={label(car.status)} />
            </dl>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-4">Description</h2>
            <p className="text-ink/80 leading-relaxed whitespace-pre-line">{car.description}</p>
          </section>
        </div>

        <aside className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-brand rounded-xl border border-neutral-200 shadow-lg p-6">
            <p className="eyebrow text-ink">Price</p>
            <p className="font-display text-4xl sm:text-5xl font-bold mb-5">{formatINR(car.price)}</p>
            {car.status === "SOLD" ? (
              <button type="button" disabled className="btn btn-ink w-full">
                Sold
              </button>
            ) : (
              <button type="button" onClick={handleBuyNow} className="btn btn-ink w-full">
                Buy now
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <p className="eyebrow mb-2">Sold by</p>
            <p className="flex items-center gap-2 font-display text-xl font-bold">
              {car.dealerId?.Name || "Unknown dealer"}
              {car.dealerId?.Name && <BadgeCheck size={20} className="text-ink" aria-label="Verified dealer" />}
            </p>
            {car.dealerId?.Email && <p className="text-sm text-ink/70 mt-1 break-all">{car.dealerId.Email}</p>}
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-display text-xl font-bold tracking-tight mb-4">Contact the dealer</h3>

            {!user ? (
              <div className="text-sm text-ink/80 space-y-4">
                <p>Log in to send the dealer a message about this car.</p>
                <button type="button" onClick={goToLogin} className="btn btn-ink w-full">
                  Log in to contact dealer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block">
                  <span className="sr-only">Full name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Full name"
                    className="field"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="Email"
                    className="field"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    pattern="[0-9+\s-]{10,15}"
                    title="10 to 15 digits"
                    placeholder="Phone (optional)"
                    className="field"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    placeholder={`I am interested in this ${car.brand} ${car.model}`}
                    className="field"
                  />
                </label>

                <button type="submit" disabled={sending} className="btn btn-brand w-full">
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} car={car} user={user} />
      )}
    </main>
  );
};

const PaymentModal = ({ onClose, car, user }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    fullName: user?.Name || "",
    address: "",
    city: "",
    zipCode: "",
    phone: user?.Phone || "",
    upiId: "",
  });

  useModal(true, loading ? undefined : onClose);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/create-order", {
        carId: car._id,
        dealerId: car.dealerId?._id || car.dealerId,
        amount: car.price,
        customerDetails: {
          ...formData,
          paymentMethod,
        },
      });
      if (res.data.success) {
        showToast("Payment successful! The car is yours.");
        onClose();
        navigate("/profile", { state: { tab: "orders" } });
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Payment failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="bg-mist rounded-xl border border-neutral-200 shadow-lg max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="checkout-title" className="font-display text-2xl font-bold tracking-tight">
            Secure checkout
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-mist-deep focus-visible:outline-3 focus-visible:outline-ink"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8 bg-brand p-5 rounded-xl border border-neutral-200 text-ink">
          <h3 className="eyebrow mb-2">Final amount</h3>
          <div className="flex justify-between items-end gap-4">
            <p className="font-display text-lg font-bold">
              {car.brand} {car.model}
            </p>
            <span className="font-display text-2xl sm:text-3xl font-bold">{formatINR(car.price)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-4">
            <h4 className="eyebrow border-b border-neutral-200 pb-2">Delivery & contact</h4>
            <div className="grid grid-cols-1 gap-3">
              <input required name="fullName" value={formData.fullName} onChange={handleInputChange} autoComplete="name" placeholder="Full Name" aria-label="Full name" className="field" />
              <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} autoComplete="tel" pattern="[0-9+\s-]{10,15}" title="10 to 15 digits" placeholder="Phone Number" aria-label="Phone number" className="field" />
              <input required name="address" value={formData.address} onChange={handleInputChange} autoComplete="street-address" placeholder="Street Address" aria-label="Street address" className="field" />
              <div className="grid grid-cols-2 gap-3">
                <input required name="city" value={formData.city} onChange={handleInputChange} autoComplete="address-level2" placeholder="City" aria-label="City" className="field" />
                <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} autoComplete="postal-code" inputMode="numeric" pattern="\d{6}" title="6-digit PIN code" placeholder="PIN Code" aria-label="PIN code" className="field" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="eyebrow border-b border-neutral-200 pb-2">Payment method</h4>
            <div className="flex rounded-xl border border-neutral-200" role="tablist">
              {[
                { id: "card", icon: CreditCard, text: "Card" },
                { id: "upi", icon: Smartphone, text: "UPI" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={paymentMethod === m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm transition-colors focus-visible:outline-3 focus-visible:outline-ink ${
                    paymentMethod === m.id ? "bg-ink text-white" : "bg-white text-ink hover:bg-mist-deep"
                  }`}
                >
                  <m.icon size={18} aria-hidden="true" /> {m.text}
                </button>
              ))}
            </div>

            <div className="p-5 bg-mist-deep rounded-xl border border-neutral-200">
              {paymentMethod === "card" ? (
                <div className="space-y-3">
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60" size={18} aria-hidden="true" />
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="Card Number"
                      aria-label="Card number"
                      className="field pl-12"
                      pattern="(\d{4}[\s-]?){3}\d{4}"
                      title="16-digit card number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      aria-label="Expiry date"
                      pattern="(0[1-9]|1[0-2])\/\d{2}"
                      title="Expiry as MM/YY"
                      className="field"
                    />
                    <input
                      required
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVV"
                      aria-label="CVV"
                      pattern="\d{3,4}"
                      title="3 or 4 digits"
                      className="field"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60" size={18} aria-hidden="true" />
                    <input
                      required
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="username@bank"
                      aria-label="UPI ID"
                      pattern="[\w.\-]+@[\w]+"
                      title="UPI ID like name@bank"
                      className="field pl-12"
                    />
                  </div>
                  <p className="text-xs text-ink/70 text-center">You will receive a request on your UPI app</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} disabled={loading} className="btn btn-light flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-brand flex-[2]">
              {loading ? "Processing..." : `Pay ${formatINR(car.price)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Spec = ({ icon, label: text, value }) => {
  const Icon = icon;
  return (
    <div className="flex gap-3">
      <Icon className="text-white shrink-0" aria-hidden="true" />
      <div>
        <dt className="eyebrow text-brand">{text}</dt>
        <dd className="font-display text-lg font-bold">{value}</dd>
      </div>
    </div>
  );
};

export default CarDetailPage;
