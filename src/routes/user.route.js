const express=require("express");
const {createUser}=require("../contoller/user.controller");
const router=express.Router();

router.post('/',createUser);

module.exports=router;