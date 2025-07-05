const express=require("express");
const router=express.Router();
const {createNote,updateNote, deleteNote, getNotes}=require("../controller/notes.controller");
router.route("/")
  .post(createNote)         
  .put(updateNote);
router.route("/:id")
  .get(getNotes)     
  .delete(deleteNote); 

module.exports=router;