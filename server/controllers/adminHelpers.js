const User = require("../models/userSchema");
const Car = require("../models/carSchema");
const Order = require("../models/orderSchema");
const Contact = require("../models/contactSchema");
module.exports = {
    getContacts: async (req, res) => {
        try {
            const contacts = await Contact.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: contacts.length,
                contacts,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch messages",
                error: error.message,
            });
        }
    },

    updateContactStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const contact = await Contact.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Message status updated",
                contact
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to update status",
                error: error.message
            });
        }
    },
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

    getSoldCars: async (req, res) => {
        try {
            // Find ALL orders (since admin sees everything)
            const orders = await Order.find()
                .populate("carId") // Get car details
                .populate("userId", "Name Email Phone") // Get buyer details
                .populate("dealerId", "Name Email Phone") // Get dealer details too
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: orders.length,
                orders, // Return orders instead of cars
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch sold cars",
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
            console.log(id, status)
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
    },
    // Delete Order (Sold History)
    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await Order.findById(id);

            if (!order) {
                return res.status(404).json({ success: false, message: "Order records not found" });
            }

            // Also delete the car associated with this order
            if (order.carId) {
                await Car.findByIdAndDelete(order.carId);
            }
            await Order.findByIdAndDelete(id);

            res.status(200).json({ success: true, message: "Sold vehicle record and car details deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getDashboardStats: async (req, res) => {
        try {
            const [orders, cars, users] = await Promise.all([
                Order.find(),
                Car.find(),
                User.find()
            ]);

            const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            const totalProfit = orders.reduce((acc, curr) => acc + (curr.profit || 0), 0);
            const totalCarsSold = orders.length;
            const totalInventory = cars.length;
            const totalUsers = users.length;
            const totalDealers = users.filter(u => u.role === 'dealer').length;

            res.status(200).json({
                success: true,
                stats: {
                    totalRevenue,
                    totalProfit,
                    totalCarsSold,
                    totalInventory,
                    totalUsers,
                    totalDealers
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
        }
    }
};