var express = require('express');
const authHelper = require('../controllers/authHelper');
var router = express.Router();

router.post('/signup', authHelper.doSignup)
module.exports = router;
