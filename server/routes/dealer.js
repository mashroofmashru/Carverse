var express = require('express');
const dealerHelpers = require('../controllers/dealerHelpers');
const upload = require("../config/upload");
var router = express.Router();
var auth= require("../middlewares/authMiddleware.js");
var authorize= require("../middlewares/authorizeMiddleware.js")

//routers--------
router.post('/addcar',auth, authorize(["dealer"]),upload.array("images", 10), dealerHelpers.addCar);

module.exports = router;
