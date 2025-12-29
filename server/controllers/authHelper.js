const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

module.exports = {
    //signup function---------------------------------------------
    doSignup: async (req, res, next) => {
        try {
            req.body.Password = await bcrypt.hash(req.body.Password, 10);

            const { Name, Email, Password, Role } = req.body;

            const user = await User.create({
                Name,
                Email,
                Password,
                Role,
            });

            //for token creation
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.Role,
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
                data: {
                    id: user._id,
                    Name: user.Name,
                    Email: user.Email,
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
                    role: user.Role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({
                success: true,
                token,
                data: {
                    _id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    role: user.Role,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Login failed" });
        }
    },

};
