var express = require('express');
const authHelper = require('../controllers/authHelper');
var router = express.Router();

//auth routers
router.post('/signup', authHelper.doSignup)
router.post('/login',authHelper.doLogin)

module.exports = router;
