var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
  console.log("Hello form admin");
  res.json({ message: "Hello from server admin side!" });
})
module.exports = router;
