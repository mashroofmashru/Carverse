const Car = require("../models/carSchema");
const Enquiry = require("../models/enquirySchema")
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

  //addCar--------------------------------
  addCar: async (req, res, next) => {
    try {

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
        dealerId: req.user.id,
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

  //deleteCar-------------------------------------
  deleteCar: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCar = await Car.findByIdAndDelete(id);

      if (!deletedCar) {
        return res.status(404).json({ success: false, message: "Car not found" });
      }

      res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  //getInventory----------------------------------
  getInventory: async (req, res) => {
    try {
      const cars = await Car.find({dealerId: req.user.id});

      res.status(200).json({
        success: true,
        count: cars.length,
        cars,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch cars",
        error: error.message,
      });
    }
  },

  //get enquaries
  getEnquiries: async (req, res) => {
    try {
      const enquiries = await Enquiry.find({
        dealerId: req.user.id,
      })
        .populate("carId", "title brand model price")
        .sort({ createdAt: -1 });
      res.json({ success: true, enquiries });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch enquiries",
      });
    }
  },

  //delete Enquery--------------------
  deleteEnquiry: async (req, res) => {
    try {
      const { id } = req.params;
      const enquiry = await Enquiry.findById(id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found", });
      }

      if (
        req.user.role !== "admin" &&
        enquiry.dealerId.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      await enquiry.deleteOne();

      res.json({
        success: true,
        message: "Enquiry deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to delete enquiry",
      });
    }
  }
};
