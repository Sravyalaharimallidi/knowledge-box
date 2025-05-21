const express=require("express");
const {createUser,updateUser}=require("../contoller/user.controller");
const router=express.Router();

router.route('/').post(createUser)
.put(updateUser);

module.exports=router;