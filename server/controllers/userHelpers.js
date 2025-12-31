const Car = require("../models/carSchema");
const Enquiry = require("../models/enquirySchema")
const axios = require('axios');
module.exports = {
    getFeaturedCars: async (req, res, next) => {
        try {
            const cars = await Car.find().limit(6);

            res.status(200).json({
                success: true,
                count: cars.length,
                cars,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to fetch cars",
                error: error.message,
            });
        }
    },
    getAllCars: async (req, res, next) => {
        try {
            const cars = await Car.find();

            res.status(200).json({
                success: true,
                count: cars.length,
                cars,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to fetch cars",
                error: error.message,
            });
        }
    },
    getCardetails: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id)
            const car = await Car.findById(id).populate("dealerId", "Name Email Phone")
            if (!car) {
                return res.status(404).json({ success: false, message: "Car not found" });
            }
            res.status(200).json({
                success: true,
                car,
            });
        } catch (err) {
            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to fetch cars",
                error: err.message,
            });
        }
    },

    //seach nearest service centers-----------------------
    searchServiceCenters: async (req, res) => {
        try {
            const { locationName } = req.query;

            if (!locationName) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a location name or zip code"
                });
            }

            const API_KEY = process.env.MAPS_API_KEY;

            const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&apiKey=${API_KEY}`;
            const geocodeRes = await axios.get(geocodeUrl);

            if (!geocodeRes.data.features || geocodeRes.data.features.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Location not found. Please try a different city."
                });
            }

            const [lon, lat] = geocodeRes.data.features[0].geometry.coordinates;
            console.log(`Searching near Lon: ${lon}, Lat: ${lat}`);

            const categories = "service.vehicle.repair.car";
            const radius = 10000;

            const placesUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${API_KEY}`;

            console.log("Calling Places URL:", placesUrl);

            const response = await axios.get(placesUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'axios-client'
                }
            });

            const features = response.data.features || [];

            if (features.length === 0) {
                return res.status(200).json({
                    success: true,
                    centers: [],
                    message: "No service centers found in this area."
                });
            }

            const centers = features.slice(0, 6).map(item => {
                const p = item.properties;
                return {
                    id: p.place_id,
                    name: p.name || "Authorized Service Center",
                    address: p.address_line2 || p.formatted,
                    rating: p.rating || (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
                    reviews: Math.floor(Math.random() * 200) + 10,
                    isOpen: p.opening_hours ? true : false,
                    location: {
                        lat: p.lat,
                        lng: p.lon
                    }
                };
            });

            return res.status(200).json({
                success: true,
                count: centers.length,
                centers
            });

        } catch (error) {
            if (error.response) {
                console.error("Geoapify rejected the request:", error.response.data.message);
            } else {
                console.error("Geoapify API Error:", error.message);
            }

            return res.status(500).json({
                success: false,
                message: "Failed to fetch service centers. Please try again later."
            });
        }
    },

    //create an query------------------------------------
    createEnquery: async (req, res) => {
        try {
            const { carId, dealerId, name, email, phone, message } = req.body;

            if (!carId || !dealerId || !name || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Required fields missing",
                });
            }

            const enquiry = await Enquiry.create({
                carId,
                dealerId,
                userId: req.user?.id || null,
                name,
                email,
                phone,
                message,
            });

            res.status(201).json({
                success: true,
                message: "Enquiry sent successfully",
                enquiry,
            });
        } catch (err) {
            console.error("Enquiry error:", err);
            res.status(500).json({
                success: false,
                message: "Failed to send enquiry",
            });
        }
    }
};
