const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        carId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dealerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "CANCELLED"],
            default: "COMPLETED", // Assuming immediate success for this "buy now" simulation
        },
        paymentDetails: {
            method: { type: String, default: "kakaopay" }, // Example default
            transactionId: { type: String },
        },
        customerDetails: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            zipCode: { type: String, required: true },
            phone: { type: String, required: true }
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
