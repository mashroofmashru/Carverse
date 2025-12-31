var express = require('express');
const dealerHelpers = require('../controllers/dealerHelpers');
const upload = require("../config/upload");
var router = express.Router();
var auth= require("../middlewares/authMiddleware.js");
var authorize= require("../middlewares/authorizeMiddleware.js")

//dealer routers--------
router.post('/addcar',auth, authorize(["dealer"]),upload.array("images", 10), dealerHelpers.addCar);
router.get('/get-inventory',auth,authorize(["dealer"]),dealerHelpers.getInventory);
router.get('/get-enquiries',auth,authorize(["dealer"]),dealerHelpers.getEnquiries);
router.delete('/delete-enquiry/:id',auth,authorize(["dealer"]),dealerHelpers.deleteEnquiry);
module.exports = router;
