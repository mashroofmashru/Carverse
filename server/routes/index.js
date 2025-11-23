var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
  res.json({ message: "Hello from server user side!" });
})
module.exports = router;
