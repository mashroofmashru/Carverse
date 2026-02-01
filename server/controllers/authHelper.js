const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

module.exports = {
    //signup function---------------------------------------------
    doSignup: async (req, res, next) => {
        try {
            req.body.Password = await bcrypt.hash(req.body.Password, 10);

            const { Name, Email, Password, role } = req.body;

            const user = await User.create({
                Name,
                Email,
                Password,
                role,
            });

            //for token creation
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            console.log("token:" + token)

            //json response
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                token,
                user: {
                    _id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    role: user.role,
                    status: user.status,
                    isApplied: user.isApplied || false
                },
            });
        } catch (err) {
            console.log(err)
            if (err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered",
                });
            }

            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
            console.log("Error occured during signup:" + err)
        }
    },

    doLogin: async (req, res) => {
        try {
            const { Email, Password } = req.body;

            const user = await User.findOne({ Email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            if (!user.Password) {
                return res.status(500).json({ message: "Password not set for this user" });
            }

            const isMatch = await bcrypt.compare(Password, user.Password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    role: user.role,
                    Phone: user.Phone,
                    status: user.status,
                    isApplied: user.isApplied || false,
                    dealershipName: user.dealershipName,
                    dealershipAddress: user.dealershipAddress,
                    licenseNumber: user.licenseNumber
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Login failed" });
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-Password");
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    role: user.role,
                    Phone: user.Phone,
                    status: user.status,
                    isApplied: user.isApplied,
                    dealershipName: user.dealershipName,
                    dealershipAddress: user.dealershipAddress,
                    licenseNumber: user.licenseNumber
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    submitDealerDetails: async (req, res) => {
        try {
            const { dealershipName, dealershipAddress, licenseNumber } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            user.dealershipName = dealershipName;
            user.dealershipAddress = dealershipAddress;
            user.licenseNumber = licenseNumber;
            user.isApplied = true;

            await user.save();

            res.json({
                success: true,
                message: "Details submitted successfully! Your account is now under review.",
                user: {
                    _id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    role: user.role,
                    Phone: user.Phone,
                    status: user.status,
                    isApplied: user.isApplied,
                    dealershipName: user.dealershipName,
                    dealershipAddress: user.dealershipAddress,
                    licenseNumber: user.licenseNumber
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to submit details" });
        }
    }
};
