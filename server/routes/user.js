var express = require('express');
var router = express.Router();
const userHelpers = require('../controllers/userHelpers');

const auth = require("../middlewares/authMiddleware.js");

router.get('/featuredproducts', userHelpers.getFeaturedCars);
router.get('/getInventory', userHelpers.getAllCars);
router.get('/getcardetails/:id', userHelpers.getCardetails);
router.get('/service-centers/search', userHelpers.searchServiceCenters);
router.post('/enquiry', auth, userHelpers.createEnquery);
router.post('/create-order', auth, userHelpers.createOrder);
router.post('/contact', userHelpers.submitContact);
router.get('/orders', auth, userHelpers.getUserOrders);
router.put('/update-profile/:id', auth, userHelpers.updateProfile);

module.exports = router;
