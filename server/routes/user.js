var express = require('express');
var router = express.Router();
const userHelpers = require('../controllers/userHelpers');

router.get('/featuredproducts',userHelpers.getFeaturedCars);
router.get('/getInventory',userHelpers.getAllCars);
router.get('/getcardetails/:id',userHelpers.getCardetails);
router.get('/service-centers/search',userHelpers.searchServiceCenters);
router.post('/enquiry',userHelpers.createEnquery)
module.exports = router;
