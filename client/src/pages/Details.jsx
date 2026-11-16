import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import CarDetailPage from "../components/Details/Cardetail";
import api from "../config/server";

const Details = () => {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notFound | error

  useEffect(() => {
    let active = true;

    const fetchCar = async () => {
      setStatus("loading");
      try {
        const res = await api.get(`/getcardetails/${id}`);
        if (!active) return;
        if (res.data.success && res.data.car) {
          setCar(res.data.car);
          setStatus("ready");
        } else {
          setStatus("notFound");
        }
      } catch (err) {
        if (!active) return;
        setStatus(err.response?.status === 404 || err.response?.status === 400 ? "notFound" : "error");
      }
    };

    fetchCar();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1">
        {status === "loading" && (
          <div className="container mx-auto px-6 py-8 animate-pulse" aria-label="Loading vehicle details">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-2/3 aspect-video bg-gray-200 rounded-2xl" />
              <div className="w-full lg:w-1/3 h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        )}

        {(status === "notFound" || status === "error") && (
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {status === "notFound" ? "Car not found" : "Couldn't load this car"}
            </h1>
            <p className="text-gray-500 mt-3">
              {status === "notFound"
                ? "This listing may have been sold or removed."
                : "Please check your connection and try again."}
            </p>
            <Link
              to="/viewInventory"
              className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              Browse inventory
            </Link>
          </div>
        )}

        {status === "ready" && <CarDetailPage car={car} />}
      </div>
      <Footer />
    </div>
  );
};

export default Details;
