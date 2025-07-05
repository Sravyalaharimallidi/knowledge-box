const express=require("express");
const router=express.Router();
const {createTag,getTags}=require("../controller/tags.controller");
router.route("/").post(createTag)
.get(getTags);
module.exports=router;