var express = require('express');
const authHelper = require('../controllers/authHelper');
const authMiddleware = require('../middlewares/authMiddleware.js');
var router = express.Router();

//auth routers
router.post('/signup', authHelper.doSignup)
router.post('/login', authHelper.doLogin)
router.get('/me', authMiddleware, authHelper.getMe)
router.post('/submit-dealer-details', authMiddleware, authHelper.submitDealerDetails)

module.exports = router;
