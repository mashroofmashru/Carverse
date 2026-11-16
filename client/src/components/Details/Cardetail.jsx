import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import api from "../../config/server";
import { getImageUrl } from "../../config/imageUrl";
import { formatINR, label } from "../../utils/format";

const inputClass =
  "w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500";

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
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3">
          <h1 className="text-3xl font-bold mb-2">
            {car.brand} {car.model}
          </h1>
          <p className="text-gray-500 mb-6">{car.title}</p>

          <div className="bg-white rounded-2xl p-2 shadow mb-8">
            <div className="aspect-video overflow-hidden rounded-xl mb-2 bg-gray-100">
              {mainImage && <img src={mainImage} alt={car.title} className="w-full h-full object-cover" />}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show photo ${index + 1} of ${images.length}`}
                    aria-pressed={index === activeImage}
                    className={`h-16 sm:h-24 border-2 rounded-lg overflow-hidden ${
                      index === activeImage ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow mb-8">
            <h2 className="text-xl font-bold mb-6">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Spec icon={CalendarDays} label="Year" value={car.year} />
              <Spec icon={Gauge} label="Mileage" value={`${Number(car.mileage).toLocaleString("en-IN")} km`} />
              <Spec icon={Fuel} label="Fuel" value={label(car.fuelType)} />
              <Spec icon={Settings2} label="Transmission" value={label(car.transmission)} />
              <Spec icon={Tag} label="Category" value={label(car.category)} />
              <Spec icon={Droplet} label="Color" value={car.color} />
              <Spec icon={FileCheck} label="Status" value={label(car.status)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{car.description}</p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Price</p>
            <p className="text-4xl font-bold text-blue-600 mb-4">{formatINR(car.price)}</p>
            {car.status === "SOLD" ? (
              <button
                type="button"
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed font-bold"
              >
                Sold
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Buy Now
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500">Sold by</h3>
            <p className="font-bold">{car.dealerId?.Name || "Unknown dealer"}</p>
            {car.dealerId?.Email && <p className="text-sm text-gray-500">{car.dealerId.Email}</p>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold mb-4">Contact the dealer</h3>

            {!user ? (
              <div className="text-sm text-gray-600 space-y-4">
                <p>Log in to send the dealer a message about this car.</p>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    placeholder={`I am interested in this ${car.brand} ${car.model}`}
                    className={inputClass}
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} car={car} user={user} />
      )}
    </main>
  );
};

const modalInput =
  "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all";

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="checkout-title" className="text-2xl font-bold">
            Secure Checkout
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8 bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Final Amount</h3>
          <div className="flex justify-between items-end gap-4">
            <p className="text-lg font-bold">
              {car.brand} {car.model}
            </p>
            <span className="text-2xl sm:text-3xl font-bold">{formatINR(car.price)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Delivery & Contact</h4>
            <div className="grid grid-cols-1 gap-3">
              <input required name="fullName" value={formData.fullName} onChange={handleInputChange} autoComplete="name" placeholder="Full Name" aria-label="Full name" className={modalInput} />
              <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} autoComplete="tel" pattern="[0-9+\s-]{10,15}" title="10 to 15 digits" placeholder="Phone Number" aria-label="Phone number" className={modalInput} />
              <input required name="address" value={formData.address} onChange={handleInputChange} autoComplete="street-address" placeholder="Street Address" aria-label="Street address" className={modalInput} />
              <div className="grid grid-cols-2 gap-3">
                <input required name="city" value={formData.city} onChange={handleInputChange} autoComplete="address-level2" placeholder="City" aria-label="City" className={modalInput} />
                <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} autoComplete="postal-code" inputMode="numeric" pattern="\d{6}" title="6-digit PIN code" placeholder="PIN Code" aria-label="PIN code" className={modalInput} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Payment Method</h4>
            <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1" role="tablist">
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
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    paymentMethod === m.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <m.icon size={18} /> {m.text}
                </button>
              ))}
            </div>

            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
              {paymentMethod === "card" ? (
                <div className="space-y-3">
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="Card Number"
                      aria-label="Card number"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
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
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center italic">You will receive a request on your UPI app</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all"
            >
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
    <Icon className="text-blue-600 shrink-0" aria-hidden="true" />
    <div>
      <p className="text-xs text-gray-500">{text}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
  );
};

export default CarDetailPage;
