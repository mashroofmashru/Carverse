var express = require('express');
const dealerHelpers = require('../controllers/dealerHelpers');
const upload = require("../config/upload");
var router = express.Router();

router.post('/addcar',upload.array("images", 10), dealerHelpers.addCar);

module.exports = router;
