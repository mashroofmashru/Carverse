var express = require('express');
var router = express.Router();
const userHelpers = require('../controllers/userHelpers');

router.get('/featuredproducts',userHelpers.getFeaturedCars);

module.exports = router;
