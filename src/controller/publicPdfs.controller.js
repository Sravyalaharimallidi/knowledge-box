const {supabase}=require("../db/db");
const {PublicSchema}=require("../zod/project.validation");
const makePdfPublic=async(req,res)=>{
    const result=PublicSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({
            error:"bad request",
            message:result.error.message
        });
    }
    try{
        const {id:pdf_id,tags}=result.data;
    for(const tag of tags){
        const { data:tagdata, error:error } = await supabase
        .from('tags')
        .select('id')
        .eq('tag_name',tag)
        .single();
        if(error) throw error;
        if (!tagdata) {
  return res.status(404).json({ message: `Tag not found: ${tag}` });
}
        const tagid=tagdata?.id;
        const {error:tagError}=await supabase
        .from('public_pdfs')
        .insert([{pdf_id:pdf_id,tag_id:tagid}]);
        if(tagError) throw tagError;
    }
    res.status(200).json({
        message:"pdf is made public"
    });}catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
const removePdfPublic=async(req,res)=>{
    try{
    const pdf_id=req.query.id;
    const response = await supabase
  .from('public_pdfs')
  .delete()
  .eq('pdf_id', pdf_id);
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
const addPdfLike = async (req, res) => {
    try {
      const { id } = req.params;
  
      const { error } = await supabase.rpc('add_like', {
        resource_id: id,
        table_name: 'pdf'
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
  const removePdfLike = async (req, res) => {
    try {
      const { id } = req.params;
  
      const { error } = await supabase.rpc('remove_like', {
        resource_id: id,
        table_name: 'pdf'
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

const getPdfs=async(req,res)=>{
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
  .from("public_pdfs")
  .select("pdf_id")
  .in("tag_id", tagIds); 
if(resourceError) throw resourceError;
if(resourceId.length==0){
  res.send("no cards are found for the tag");
  return;
}
const resourceIds = resourceId.map(resource => resource.pdf_id); 
        const { data:finalData, error:error } = await supabase
  .from('pdf')
  .select(`id,pdf_url,likes,user_id,users (full_name)`)
  .in('id',resourceIds)
  .order('likes', { ascending: false });
  if(error) throw error;
  res.send(finalData);
    }
    else {
  return res.status(400).json({ message: "Missing search query" });
}
    }catch(err){
      res.status(500).json({
        error: 'server error',
        message: err.message,
      });
}}
 
module.exports={makePdfPublic,removePdfPublic,addPdfLike,removePdfLike,getPdfs};