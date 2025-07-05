const express=require("express");
const router=express.Router();
const {makeLinkPublic,removeLinkPublic,addLinkLike,removeLinkLike,getLinks}=require("../controller/publiclinks.controller");
const {makePdfPublic,removePdfPublic,addPdfLike,removePdfLike,getPdfs}=require("../controller/publicPdfs.controller");
router.route("/link").post(makeLinkPublic)
.delete(removeLinkPublic)
.get(getLinks);
router.route("/link/:id/addlike").post(addLinkLike);
router.route("/link/:id/removelike").delete(removeLinkLike);
router.route("/pdf").post(makePdfPublic)
.delete(removePdfPublic)
.get(getPdfs);
router.route("/pdf/:id/like").post(addPdfLike);     
router.route("/pdf/:id/like").delete(removePdfLike); 
module.exports=router;