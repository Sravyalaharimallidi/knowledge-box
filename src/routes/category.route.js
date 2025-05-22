const express=require("express");
const router=express.Router();
const {createCategory,getCategories, updateCategory,deleteCategory}=require("../contoller/category.controller");
router.route('/').post(createCategory)
.put(updateCategory)
.get(getCategories)
.delete(deleteCategory);
module.exports=router;