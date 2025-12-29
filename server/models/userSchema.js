const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Role: {
      type: String,
      enum: ["user", "dealer", "admin"],
      default: "user",
      required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
