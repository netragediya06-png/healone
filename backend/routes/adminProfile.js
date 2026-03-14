const express = require("express");
const router = express.Router();

router.get("/profile",(req,res)=>{

 res.json({
   name:"Admin",
   email:"admin@gmail.com",
   profileImage:"/uploads/admin.png"
 });

});

module.exports = router;