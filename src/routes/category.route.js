const express=require("express");
const router=express.Router();
const {createCategory,getCategories, updateCategory,deleteCategory}=require("../controller/category.controller");
router.route('/').post(createCategory)
.put(updateCategory)
router.route('/:id').get(getCategories)
.delete(deleteCategory);
module.exports=router;