const {supabase}=require("../db/db");
const CategorySchema=require("../zod/project.validation");
const createCategory=async(req,res)=>{
    result=CategorySchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:"invalid input",
            message:result.error.message
        });
    }
    try{
const name=result.body;

    }catch(err){}
}