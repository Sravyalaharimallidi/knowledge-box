const {supabase,supabaseUrl,bucket}=require("../db/db");
const {CardSchema}=require("../zod/project.validation");
const storepdf=async(req,res)=>{
    if(!req.file){
      return  res.status(400).json({
            error:"no file",
        });
    }
    try{
    const file=req.file;
    const fileBuffer=file.buffer;
    const fileName=`file_${Date.now()}.${file.originalname.split('.').pop()}`;
    const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
          });
          if(error) throw error;
          const pdf_url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;


          const result=CardSchema.safeParse(req.body);
          if(!result.success){
          return  res.status(400).json({
                error:"bad request",
                message:result.error.message
            });
          }
          const {category_id,title,description,is_favorite,is_public,user_id}=result.data;

          const {data:pdfData ,error:dbError } = await supabase
  .from('pdf')
  .insert({ category_id: category_id,title:title,pdf_url:pdf_url,description:description,is_favorite:is_favorite,is_public:is_public,likes:0,
    created_at:new Date().toISOString(),
    last_accessed_at:new Date().toISOString(),
    user_id:user_id})
    .select('id')
    .single();
  if(dbError) throw dbError;
 return res.status(201).json({
    message:"pdf uploaded",
    pdf_id:pdfData?.id
  });
          }catch(err){
    res.status(500).json({
        error:"server error",
        message:err.message
    });
}
}
const updatepdf=async(req,res)=>{
   try{
const { data: oldData, error: fetchError } = await supabase
.from('pdf')
.select('pdf_url')
.eq('id', req.body.card_id)
.single();

if (fetchError) throw fetchError;

const oldPath = oldData?.pdf_url.split(`/storage/v1/object/public/${bucket}/`)[1];

const file=req.file;
const fileBuffer=file.buffer;
const { data, error } = await supabase
  .storage
  .from(bucket)
  .update(oldPath, fileBuffer, {
    cacheControl: '3600',
    upsert: true
  })
          if(error) throw error;
          const pdf_url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;
const result=CardSchema.safeParse(req.body);
          if(!result.success){
          return  res.status(400).json({
                error:"bad request",
                message:result.error.message
            });
          }
          const {card_id,title,description,is_favorite,is_public}=result.data;

          const { error:dbError } = await supabase
  .from('pdf')
  .update({ title:title,
    pdf_url:pdf_url,description:description,is_favorite:is_favorite,is_public:is_public,last_accessed_at:new Date().toISOString()
})
  .eq('id', card_id);
  if(dbError) throw dbError;
  res.status(200).json({
    message:"pdf data updated"
  });
          }catch(err){
    res.status(500).json({
        error:"server error",
        message:err.message
    });
}
}
const deletepdf=async(req,res)=>{
  try{
    const card_id=req.params.id;
    const { data: oldData, error: fetchError } = await supabase
.from('pdf')
.select('pdf_url')
.eq('id', card_id)
.single();

if (fetchError) throw fetchError;
if (oldData?.pdf_url) {
const oldPath = oldData.pdf_url.split(`/storage/v1/object/public/${bucket}/`)[1];
if (oldPath) {
  await supabase.storage.from(bucket).remove([oldPath]);
}
}
const response = await supabase
  .from('pdf')
  .delete()
  .eq('id', card_id);
  if(response.error) throw response.error;
  res.status(200).json({
    message:"pdf deleted"
  });

  }catch(err){
    res.status(500).json({
      error:"server error",
      message:err.message
  });
  }
}
const getpdfs=async(req,res)=>{
  try{
    const category_id=req.params.id;
    const {data:authData,error:authError}=await supabase
                                              .from('pdf')
                                              .select('id,title,pdf_url,description')
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
module.exports={storepdf,updatepdf,deletepdf,getpdfs};