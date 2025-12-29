const Car = require("../models/carSchema");

module.exports = {
  //create dealer profile-------------------------
  createDealerProfile: async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "dealer") {
      return res.status(403).json({
        message: "Only dealer accounts can create dealer profile",
      });
    }

    const dealer = await Dealer.create({
      user: user._id,
      name: req.body.name,
      phone: req.body.phone,
    });

    res.json({ success: true, dealer });
  },

  //addCar----------------------------
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
        category: req.body.category,
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
