import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import {
  Gauge,
  Fuel,
  Settings2,
  Droplet,
  FileCheck,
  MessageCircle,
  CalendarDays,
  Star,
} from "lucide-react";
import api from "../../config/server";

const BASE_URL = "http://localhost:3000";

const CarDetailPage = ({ car }) => {
  const { user } = useAuth();

  const [mainImage, setMainImage] = useState("");
  const [activeThumbnailId, setActiveThumbnailId] = useState(null);

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
                  className={`h-24 border-2 rounded-lg ${
                    img.id === activeThumbnailId
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
            <p className="text-4xl font-bold text-blue-600">
              ₹{car.price.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold">Sold By</h3>
            <p>{car.dealerId?.Name}</p>
            <p className="text-sm text-gray-500">{car.dealerId?.Email}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Verified Dealer
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold mb-4">Contact Dealer</h3>

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
    </main>
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
