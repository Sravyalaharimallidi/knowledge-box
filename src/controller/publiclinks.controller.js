const {supabase}=require("../db/db");
const {PublicSchema}=require("../zod/project.validation");
const makeLinkPublic=async(req,res)=>{
    const result=PublicSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
        const {id:card_id,tags}=result.data;
    for(const tag of tags){
        const { data:tagdata, error:error } = await supabase
        .from('tags')
        .select('id')
        .eq('tag_name',tag)
        .single();
        if(error) throw error;
        const tagid=tagdata?.id;
        const {error:tagError}=await supabase
        .from('public_cards')
        .insert([{card_id:card_id,tag_id:tagid}]);
        if(tagError) throw tagError;
    }
    res.status(200).json({
        message:"link is made public"
    })}catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const removeLinkPublic=async(req,res)=>{
    try{
    const {id:card_id}=req.body;
    const response = await supabase
  .from('public_cards')
  .delete()
  .eq('card_id', card_id);
  if(response.error) throw response.error;
  res.status(200).json({
    message:"removed from public"
  })
}catch(err){
    res.status(500).json({
        error:"server error",
        message:err.message
    });
}}
const addLinkLike = async (req, res) => {
    try {
      const { id } = req.params;
  
      const { error } = await supabase.rpc('add_like', {
        resource_id: id,
        table_name: 'cards'
      });
  
      if (error) throw error;
  
      res.status(200).json({ message: 'Added like' });
  
    } catch (err) {
      res.status(500).json({
        error: 'server error',
        message: err.message,
      });
    }
  };
  const removeLinkLike = async (req, res) => {
    try {
      const { id } = req.params;
  
      const { error } = await supabase.rpc('remove_like', {
        resource_id: id,
        table_name: 'cards'
      });
  
      if (error) throw error;
  
      res.status(200).json({ message: 'removed like' });
  
    } catch (err) {
      res.status(500).json({
        error: 'server error',
        message: err.message,
      });
    }
  };
const getLinks=async(req,res)=>{
    try{
    if(req.query.search){
        const search=req.query.search.toLowerCase();
    const {data:tags,error:tagError}=await supabase
    .from("tags")
    .select('id,tag_name');
    if(tagError) throw tagError;
    
    const filteredTags = tags.filter((tags) =>
        tags.tag_name.toLowerCase().includes(search)
      );
      const tagIds = filteredTags.map(tag => tag.id); 
if(tagIds.length==0){
    res.send("no matching search results");
    return;
}
const { data: resourceId, error: resourceError } = await supabase
  .from("public_cards")
  .select("card_id")
  .in("tag_id", tagIds); 
if(resourceError) throw resourceError;
if(resourceId.length==0){
  res.send("no cards are found for the tag");
  return;
}
const resourceIds = resourceId.map(resource => resource.card_id); 
        const { data:finalData, error:error } = await supabase
  .from('cards')
  .select(`id,link,likes,user_id,users (full_name)`)
  .in('id',resourceIds)
  .order('likes', { ascending: false });
  if(error) throw error;
  res.send(finalData);
    }
    }catch(err){
      res.status(500).json({
        error: 'server error',
        message: err.message,
      });
    }}
module.exports={makeLinkPublic,removeLinkPublic,addLinkLike,removeLinkLike,getLinks};