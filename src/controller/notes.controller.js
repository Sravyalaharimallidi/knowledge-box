const {supabase}=require("../db/db");
const {CardSchema}=require("../zod/project.validation");
const createNote=async(req,res)=>{
    const result=CardSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
        const {category_id,title,content,is_favorite,is_public,user_id}=result.data;
        const {data:notesData, error } = await supabase
        .from('notes')
        .insert({category_id: category_id,title:title,content:content,is_favorite:is_favorite,is_public:is_public,likes:0,
            created_at:new Date().toISOString(),
            last_accessed_at:new Date().toISOString(),
            user_id:user_id
         })
         .select('id')
         .single();
         if(error) throw error;
         res.status(201).json({
            message:"note created",
            notesId:notesData?.id
         });

    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const updateNote=async(req,res)=>{
    const result=CardSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
const {card_id,title,content,is_favorite,is_public}=result.data;
const { error } = await supabase
  .from('notes')
  .update({ title:title,
    content:content,is_favorite:is_favorite,is_public:is_public,last_accessed_at:new Date().toISOString()
})
  .eq('id', card_id);
  if(error) throw error;
  res.status(200).json({
    message:"note updated",
  });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const deleteNote=async(req,res)=>{
    try{
const {id}=req.params;
const response = await supabase
  .from('notes')
  .delete()
  .eq('id', id);
  if(response.error) throw response.error;
  res.status(200).json({
    message:"Note deleted"
  });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        }); 
    }
}
const getNotes=async(req,res)=>{
    try{
        const {id:category_id}=req.params;
        const {data:authData,error:authError}=await supabase
                                                  .from('notes')
                                                  .select('id,title,content')
                                                  .eq('category_id',category_id);
    if(authError) throw authError;
    res.send(authData);
    }catch(err){
        res.status(500).json({
            error:"database error",
            message:err.message
        });  
    }
}
module.exports={createNote,updateNote,deleteNote,getNotes};