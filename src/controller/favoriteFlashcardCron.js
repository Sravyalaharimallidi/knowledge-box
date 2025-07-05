const {supabase}=require("../db/db");
const cron=require("node-cron");

const storeflashCards=async(req,res)=>{
try{
  const { error:dltError } = await supabase
  .from('favorite_flashcards')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000'); 
  if(dltError) throw dltError;
const {data:users,error:userError}=await supabase
                                         .from('users')
                                         .select();
if(userError) throw userError;
for(const user of users){
const {data:linkdata,error:linkerror}=await supabase
.from('cards')
.select('id,user_id,title,link,description')
.eq('user_id',user?.id)
.eq('is_favorite',true);
if(linkerror) throw linkerror;
if(linkdata.length > 0){
  const randomLink=linkdata[Math.floor(Math.random()*linkdata.length)];
  const {id:card_id,user_id,title,link,description}=randomLink;
const {error:dbError}=await supabase
                     .from('favorite_flashcards')
                     .insert({card_id,user_id,title,link,description});
if(dbError) throw dbError;
} 
const {data:pdfdata,error:pdferror}=await supabase
.from('pdf')
.select('id,user_id,title,pdf_url,description')
.eq('user_id',user?.id)
.eq('is_favorite',true);
if(pdferror) throw pdferror;
if(pdfdata.length > 0){
  const randompdf=pdfdata[Math.floor(Math.random()*pdfdata.length)];
  const {id:card_id,user_id,title,pdf_url,description}=randompdf;
const {error:dbError}=await supabase
                     .from('favorite_flashcards')
                     .insert({card_id,user_id,title,pdf_url,description});
if(dbError) throw dbError;
} 
const {data:notesdata,error:noteserror}=await supabase
.from('notes')
.select('id,user_id,title,content')
.eq('user_id',user?.id)
.eq('is_favorite',true);
if(noteserror) throw noteserror;
if(notesdata.length > 0){
  const randomnotes=notesdata[Math.floor(Math.random()*notesdata.length)];
  const {id:card_id,user_id,title,content:notes}=randomnotes;
const {error:dbError}=await supabase
                     .from('favorite_flashcards')
                     .insert({card_id,user_id,title,notes});
if(dbError) throw dbError;
} 
}  
console.log("updated");
}catch(err){
  console.error(err.message);  
}
}
cron.schedule('0 0 * * *', async () => {
  storeflashCards();
});

module.exports={storeflashCards};