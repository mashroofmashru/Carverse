var express = require('express');
var router = express.Router();
var adminHelpers=require('../controllers/adminHelpers')
var auth= require("../middlewares/authMiddleware.js");
var authorize= require("../middlewares/authorizeMiddleware.js")

//admin
router.get('/getusers',auth, authorize(["admin"]),adminHelpers.getAllUsers);
router.get('/get-inventory',auth, authorize(["admin"]),adminHelpers.getInventory);
router.put('/update-profile/:id',auth, authorize(["admin"]),adminHelpers.updateProfile);
router.delete('/delete-car/:id',auth, authorize(["admin"]),adminHelpers.deleteCar);
router.delete('/delete-user/:id',auth,authorize(["admin"]),adminHelpers.deleteUser);
router.patch('/update-user-status/:id',auth,authorize(["admin"]),adminHelpers.updateUserStatus);
module.exports = router;
