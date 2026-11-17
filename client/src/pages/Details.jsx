import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-mist text-ink">
      <Navbar />
      <div className="flex-1">
        {status === "loading" && (
          <div className="container mx-auto px-4 sm:px-6 py-10 animate-pulse" aria-label="Loading vehicle details">
            <div className="h-10 w-72 bg-mist-deep border border-neutral-200 mb-8" />
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-2/3 aspect-video bg-mist-deep border border-neutral-200" />
              <div className="w-full lg:w-1/3 h-64 bg-mist-deep border border-neutral-200" />
            </div>
          </div>
        )}

        {(status === "notFound" || status === "error") && (
          <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
            <p className="eyebrow mb-3">{status === "notFound" ? "404" : "Error"}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              {status === "notFound" ? "Car not found" : "Couldn't load this car"}
            </h1>
            <p className="text-ink/70 mt-4 text-lg">
              {status === "notFound"
                ? "This listing may have been sold or removed."
                : "Please check your connection and try again."}
            </p>
            <Link to="/viewInventory" className="btn btn-brand mt-8">
              <ArrowLeft size={18} aria-hidden="true" /> Browse inventory
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
