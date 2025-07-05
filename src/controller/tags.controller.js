const {supabase}=require("../db/db");
const {TagSchema}=require("../zod/project.validation");
const createTag=async(req,res)=>{
    const result=TagSchema.safeParse(req.body);
    if(!result.success){
      return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
const {name:tag_name}=result.data;
const {error:tagError}=await supabase
.from("tags")
.insert([{tag_name:tag_name}]);
if(tagError) throw tagError;
res.status(201).json({
    message:"tag created"
});
    }
    catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const getTags=async(req,res)=>{
    try{
        const {data:tags,error:error}=await supabase
        .from("tags")
        .select('tag_name');
    if(error) throw error;
    res.status(200).json(tags);
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
module.exports={createTag,getTags};