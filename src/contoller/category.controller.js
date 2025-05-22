const {supabase}=require("../db/db");
const {UserSchema,CategorySchema}=require("../zod/project.validation");
const createCategory=async(req,res)=>{
    result=CategorySchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:"invalid input",
            message:result.error.message
        });
    }
    try{
const {email,password,name}=result.data;
const { data:authData, error:authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
if(authError) throw authError;
const {data:dbData,error:dbError}=await supabase
                           .from('categories')
                           .insert([{
                            user_id:authData?.user?.id,
                            name:name,
                            created_at:new Date().toISOString()
                           }]);
if(dbError) throw dbError;

res.status(201).json({
    message:"category created"
})
    }catch(err){
        res.status(500).json({
            error:"database error",
            message:err.message
        });
    }
}
const getCategories=async(req,res)=>{
    try{
        const {id}=req.body;
        const {data:authData,error:authError}=await supabase
                                                  .from('categories')
                                                  .select('id,name')
                                                  .eq('user_id',id);
    if(authError) throw authError;
    res.send(authData);
    }catch(err){
        res.status(500).json({
            error:"database error",
            message:err.message
        });  
    }
}
module.exports={createCategory,getCategories};