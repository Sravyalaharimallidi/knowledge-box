const {supabase}=require("../db/db");
const {CategorySchema}=require("../zod/project.validation");
const createCategory=async(req,res)=>{
   const result=CategorySchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:"invalid input",
            message:result.error.message
        });
    }
    try{
const {user_id,name}=result.data;
const {data:dbData,error:dbError}=await supabase
                           .from('categories')
                           .insert([{
                            user_id:user_id,
                            name:name,
                            created_at:new Date().toISOString()
                           }])
                           .select('id')
                           .single();
if(dbError) throw dbError;

res.status(201).json({
    message:"category created",
    categoryId:dbData?.id
});
    }catch(err){
        res.status(500).json({
            error:"database error",
            message:err.message
        });
    }
}
const getCategories=async(req,res)=>{
    try{
        const {id}=req.params;
        const {data:authData,error:authError}=await supabase
                                                  .from('categories')
                                                  .select('id,name,user_id')
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
const updateCategory=async(req,res)=>{
    const result=CategorySchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
        const{id,name}=result.data;
        const { error: updateError } = await supabase
                                  .from('categories')
                                  .update({ name })
                                  .eq('id', id);
     if (updateError) throw updateError;
      res.status(200).json({
        message:"category updated"
    });
}catch(err){
        res.status(500).json({
            error:"database error",
            message:err.message
        });  
    }
}
const deleteCategory=async(req,res)=>{
    try{
    const {id}=req.params;
    const response = await supabase
  .from('categories')
  .delete()
  .eq('id', id);
  if(response.error) throw response.error;
  res.status(200).json({
message:"category deleted"
  });
}catch(err){
    res.status(500).json({
        error:"database error",
        message:err.message
    });  
}
}
module.exports={createCategory,getCategories,updateCategory,deleteCategory};