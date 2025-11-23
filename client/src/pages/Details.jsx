import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/Details/Footer";
import CarDetailPage from "../components/Details/Cardetail";

const Details = () => {
    return (
        <>
            <Navbar />
            <CarDetailPage/>
            <Footer/>
        </>
    );
}

export default Details;