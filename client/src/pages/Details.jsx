import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import CarDetailPage from "../components/Details/Cardetail";
import api from "../config/server";

const Details = () => {
  const { id } = useParams();

  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/getcardetails/${id}`);
        if (res.data.success) {
          setCar(res.data.car);
        } else {
          alert("Car not found");
        }
      } catch (err) {
        alert("Failed to load car details");
      } finally {
        console.log("loading completed")
      }
    };

    fetchCar();
  }, [id]);

  return (
    <>
      <Navbar />
      <CarDetailPage car={car} />
      <Footer />
    </>
  );
};

export default Details;
