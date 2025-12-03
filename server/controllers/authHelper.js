const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

module.exports = {
    doSignup: async (req, res, next) => {
        try {
            req.body.Password = await bcrypt.hash(req.body.Password, 10);

            const { Name, Email, Password } = req.body;

            const user = await User.create({
                Name,
                Email,
                Password,
            });
            console.log("user created");

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                },
            });
        } catch (err) {
            console.log("Error occured during signup:"+err)
        }
    },
};
