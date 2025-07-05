const express=require("express");
const router=express.Router();
const {createCard,updateCard, deleteCard, getCards}=require("../controller/link.controller");
router.route("/").post(createCard)
.put(updateCard)
router.route("/:id").delete(deleteCard)
.get(getCards);
module.exports=router;