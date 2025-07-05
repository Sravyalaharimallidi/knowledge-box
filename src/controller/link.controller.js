const {supabase}=require("../db/db");
const {CardSchema}=require("../zod/project.validation");
const createCard=async(req,res)=>{
    const result=CardSchema.safeParse(req.body);
    if(!result.success){
      return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
        const {category_id,title,link,description,is_favorite,is_public,user_id}=result.data;
        const {data:cardData, error } = await supabase
        .from('cards')
        .insert({category_id: category_id,title:title,link:link,description:description,is_favorite:is_favorite,is_public:is_public,likes:0,
            created_at:new Date().toISOString(),
            last_accessed_at:new Date().toISOString(),
            user_id:user_id
         })
         .select('id')
         .single();
         if(error) throw error;
         res.status(201).json({
            message:"card created",
            cardId:cardData?.id
         });

    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const updateCard=async(req,res)=>{
    const result=CardSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
const {card_id,title,link,description,is_favorite,is_public}=result.data;
const { error } = await supabase
  .from('cards')
  .update({ title:title,
    link:link,description:description,is_favorite:is_favorite,is_public:is_public,last_accessed_at:new Date().toISOString()
})
  .eq('id', card_id);
  if(error) throw error;
  res.status(200).json({
    message:"card data updated",
  });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const deleteCard=async(req,res)=>{
    try{
const {id}=req.params;
const response = await supabase
  .from('cards')
  .delete()
  .eq('id', id);
  if(response.error) throw response.error;
  res.status(200).json({
    message:"card deleted"
  });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        }); 
    }
}
const getCards=async(req,res)=>{
    try{
        const {id:category_id}=req.params;
        const {data:authData,error:authError}=await supabase
                                                  .from('cards')
                                                  .select('id,title,link,description')
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


module.exports={createCard,updateCard,deleteCard,getCards};