const User = require("../models/userSchema");
const Car = require("../models/carSchema");
module.exports = {
    getAllUsers: async (req, res) => {
        try {

            const user = await User.find();
            console.log(user)
            res.json({
                success: true,
                user,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Login failed" });
        }
    },
    getInventory: async (req, res) => {
        try {
            const cars = await Car.find();

            res.status(200).json({
                success: true,
                count: cars.length,
                cars,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to fetch cars",
                error: error.message,
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const { Name, Email, Phone } = req.body;

            // Find user by ID and update their info
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { Name, Email, Phone },
                { new: true, runValidators: true }
            ).select("-Password");

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            res.status(200).json({
                success: true,
                message: "Profile updated on server",
                user: updatedUser
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteCar: async (req, res) => {
        try {
            const { id } = req.params;

            const car = await Car.findById(id);
            if (!car) {
                return res.status(404).json({ success: false, message: "Vehicle not found" });
            }

            await Car.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: "Vehicle permanently deleted from system"
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id)
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            if (String(req.params.id || "") === String(req.user?.id || "")) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot delete your own admin account"
                });
            }

            await User.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: "User account deleted successfully"
            });
        } catch (error) {
            console.error("Delete User Error:", error);
            res.status(500).json({
                success: false,
                message: "Server error during deletion"
            });
        }
    },
    updateUserStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            console.log(id,status)
            const validStatuses = ['approved', 'blocked', 'pending'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value"
                });
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { status: status },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                message: `User status updated to ${status}`,
                user: updatedUser
            });

        } catch (error) {
            console.error("Update Status Error:", error);
            res.status(500).json({
                success: false,
                message: "Server error updating status"
            });
        }
    }
};