import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Gauge,
  Fuel,
  Settings2,
  Droplet,
  FileCheck,
  MessageCircle,
  CalendarDays,
  Star,
  CreditCard,
  Smartphone,
} from "lucide-react";
import api from "../../config/server";

const BASE_URL = "http://localhost:3000";

const CarDetailPage = ({ car }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState("");
  const [activeThumbnailId, setActiveThumbnailId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [name, setName] = useState(user?.Name || "");
  const [email, setEmail] = useState(user?.Email || "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const images =
    car?.images?.map((img, index) => ({
      id: index,
      src: BASE_URL + img,
      alt: car?.title || "car",
    })) || [];

  useEffect(() => {
    if (images.length) {
      setMainImage(images[0].src);
      setActiveThumbnailId(images[0].id);
    }
  }, [car]);

  if (!car) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading vehicle details...
      </div>
    );
  }

  const changeImage = (src, id) => {
    setMainImage(src);
    setActiveThumbnailId(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/enquiry", {
        carId: car._id,
        dealerId: car.dealerId?._id,
        name,
        email,
        phone,
        message,
      });

      alert("Message sent to dealer!");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send enquiry");
    }
  };

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-10">

        <div className="w-full lg:w-2/3">
          <h1 className="text-3xl font-bold mb-2">
            {car.brand} {car.model}
          </h1>
          <p className="text-gray-500 mb-6">{car.title}</p>

          <div className="bg-white rounded-2xl p-2 shadow mb-8">
            <div className="h-[450px] overflow-hidden rounded-xl mb-2">
              <img
                src={mainImage}
                alt={car.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => changeImage(img.src, img.id)}
                  className={`h-24 border-2 rounded-lg ${img.id === activeThumbnailId
                    ? "border-blue-600"
                    : "border-transparent opacity-60"
                    }`}
                >
                  <img src={img.src} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow mb-8">
            <h2 className="text-xl font-bold mb-6">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Spec icon={CalendarDays} label="Year" value={car.year} />
              <Spec icon={Gauge} label="Mileage" value={`${car.mileage} km`} />
              <Spec icon={Fuel} label="Fuel" value={car.fuelType} />
              <Spec icon={Settings2} label="Transmission" value={car.transmission} />
              <Spec icon={Droplet} label="Color" value={car.color} />
              <Spec icon={FileCheck} label="Status" value={car.status} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-600">{car.description}</p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Price</p>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              ₹{car.price.toLocaleString()}
            </p>
            {car.status === "SOLD" ? (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed font-bold"
              >
                SOLD OUT
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please login to buy");
                    navigate("/login");
                    return;
                  }
                  setShowPaymentModal(true)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Buy Now
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3>Sold By</h3>
            <p className="font-bold" >{car.dealerId?.Name}</p>
            <p className="text-sm text-gray-500">{car.dealerId?.Email}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Verified Dealer
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold mb-4">Book now</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full p-3 border rounded-lg"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                placeholder={`I am interested in this ${car.brand} ${car.model}`}
                className="w-full p-3 border rounded-lg"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        car={car}
        user={user}
      />
    </main>
  );
};

const PaymentModal = ({ isOpen, onClose, car, user }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'upi'
  const navigate = useNavigate();
  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.Name || "",
    address: "",
    city: "",
    zipCode: "",
    phone: user?.Phone || "",
    upiId: ""
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/create-order', {
        carId: car._id,
        dealerId: car.dealerId?._id || car.dealerId,
        amount: car.price,
        customerDetails: {
          ...formData,
          paymentMethod
        }
      });
      if (res.data.success) {
        alert("Payment Successful! Car purchased.");
        onClose();
        navigate(0);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Secure Checkout
        </h2>

        <div className="mb-8 bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Final Amount</h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-lg font-bold">{car.brand} {car.model}</p>
              <p className="text-xs opacity-70">Incl. all taxes & fees</p>
            </div>
            <span className="text-3xl font-bold">₹{car.price.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Shipping Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Delivery & Contact</h4>
            <div className="grid grid-cols-1 gap-3">
              <input required name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Street Address" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <div className="grid grid-cols-2 gap-3">
                <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="ZIP Code" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Payment Method</h4>
            <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${paymentMethod === "card" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <CreditCard size={18} /> Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${paymentMethod === "upi" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Smartphone size={18} /> UPI
              </button>
            </div>

            {/* Conditional Payment Fields */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
              {paymentMethod === "card" ? (
                <div className="space-y-3">
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/3 text-gray-400" size={18} />
                    <input required={paymentMethod === "card"} type="text" placeholder="Card Number" className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" pattern="\d{16}" title="16 digits" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input required={paymentMethod === "card"} type="text" placeholder="MM/YY" className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <input required={paymentMethod === "card"} type="text" placeholder="CVV" className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" pattern="\d{3}" title="3 digits" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required={paymentMethod === "upi"}
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="username@bank"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center italic">You will receive a request on your UPI app</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all">
              {loading ? "Processing..." : `Pay ₹${car.price.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Spec = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <Icon className="text-blue-600" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default CarDetailPage;
