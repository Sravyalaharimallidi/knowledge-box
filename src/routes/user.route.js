const express=require("express");
const {createUser,updateUser,signOutUser,getUser, signInUser}=require("../controller/user.controller");
const router=express.Router();

router.route('/').post(createUser)
.put(updateUser)
router.route('/:id').get(getUser)
router.route('/signin').post(signInUser);
router.route('/signout').post(signOutUser);

module.exports=router;