const Car = require("../models/carSchema");

module.exports = {
  addCar: async (req, res, next) => {
    try {
      console.log("TITLE:", req.body.title);
      console.log("FILES:", req.files);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required",
        });
      }

      const images = req.files.map(
        (file) => `/uploads/cars/${file.filename}`
      );

      const car = await Car.create({
        title: req.body.title,
        brand: req.body.brand,
        model: req.body.model,
        year: Number(req.body.year),
        price: Number(req.body.price),
        fuelType: req.body.fuelType,
        transmission: req.body.transmission,
        mileage: Number(req.body.mileage),
        color: req.body.color,
        description: req.body.description,
        images,
      });

      res.status(201).json({
        success: true,
        message: "Car added successfully",
        car,
      });
    } catch (error) {
      next(error);
    }
  },
};
