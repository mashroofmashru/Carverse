const Car = require("../models/carSchema");

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
};
