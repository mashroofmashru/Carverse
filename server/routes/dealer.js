var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
  console.log("Hello form dealer");
  res.json({ message: "Hello from server at dealer side!" });
})
module.exports = router;
