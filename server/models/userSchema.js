const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Phone: {
    type: String, 
    unique: true,
    spare: true,
    validate: {
      validator: function(v) {
        return !v || /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  role: {
    type: String,
    enum: ["user", "dealer", "admin"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["approved", "pending", "blocked"],
    default: function () {
      return this.role === "dealer" ? "pending" : "approved";
    },
  },
});

module.exports = mongoose.model("User", userSchema);
