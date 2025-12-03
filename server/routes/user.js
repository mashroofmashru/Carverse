var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
  console.log("Hello form user");
})
module.exports = router;
