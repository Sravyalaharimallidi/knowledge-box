const express=require("express");
const multer=require("multer");
const upload = multer();
const router=express.Router();
const {storepdf, updatepdf,deletepdf,getpdfs}=require("../controller/pdf.controller");
router.route("/").post(upload.single('file'),storepdf)
.put(upload.single('file'),updatepdf)
router.route("/:id").delete(deletepdf)
.get(getpdfs);
module.exports=router;