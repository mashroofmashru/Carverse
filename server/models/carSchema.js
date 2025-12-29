const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 1,
    },

    price: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["PETROL", "DIESEL", "ELECTRIC", "HYBRID"],
      default: "PETROL",
    },

    category: {
      type: String,
      enum: ["SUVs", "SEDAN", "HATCHBACK", "ELECTRIC"],
      default: "",
    },

    transmission: {
      type: String,
      enum: ["MANUAL", "AUTOMATIC"],
      default: "MANUAL",
    },

    mileage: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["AVAILABLE", "SOLD", "PENDING"],
      default: "AVAILABLE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);
