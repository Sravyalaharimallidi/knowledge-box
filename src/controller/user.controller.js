const {supabase}=require("../db/db");
const {UserSchema}=require("../zod/project.validation");
const createUser=async(req,res)=>{
  const result=UserSchema.safeParse(req.body);
  if(!result.success){
   return res.status(400).json({
       error: "invalid input",
       message: result.error.message
     });
  }
  try {
const {email,password,full_name}=result.data;
const { data:authData, error:authError } = await supabase.auth.signUp({
  email: email,
  password: password,
});
const userId=authData?.user?.id;
if(!userId){
  return res.status(500).json({
    error: "auth error",
    message: "No user ID returned from Supabase"
  });
}
if(authError) throw authError;
   const {error:dbError}=await supabase
                               .from('users')
                               .insert([{
                                   id:authData?.user?.id,
                                   email:email,
                                   full_name:full_name,
                                   created_at:new Date().toISOString()
                               }]);
   if(dbError) throw dbError;
   res.status(201).json({
    message: "User created",
    user_id: authData?.user?.id, 
    email: email,
    full_name: full_name
  });
  }catch(err){                          
return res.status(500).json({
error:"user creation error",
message:err.message
});
}
}

const updateUser=async(req,res)=>{
  const result=UserSchema.safeParse(req.body);
       if(!result.success){
        return res.status(400).json({
            error: "invalid input",
            message: result.error.message
          });
       }
try{
const {user_id,full_name}=result.data;
        const { error:error } = await supabase
                                            .from('users')
                                            .update({
                                              full_name:full_name
                                            })
                                            .eq('id',user_id);
  if(error) throw error;
        res.status(200).json({
          message:"user data updated"
        });
       }catch(err){
        res.status(500).json({
          error:"database error",
          message:err.message
        });
       }
}
const getUser=async(req,res)=>{
  const id=req.params.id;
  if(!id){
   return res.status(400).json({
      error:"bad request",
      message:"all fields are required"
    });
  }
  try{
const {data:userData,error:userError}=await supabase
                                           .from('users')
                                           .select('email,full_name')
                                           .eq('id',id);
if(userError) throw userError;
if(userData.length==0){
 return res.status(404).send("user not found");
}
return res.status(200).send(userData[0]);
  }catch(err){
    res.status(500).json({
          error:"database error",
          message:err.message
        });
  }
}
const signInUser=async(req,res)=>{
  const result=UserSchema.safeParse(req.body);
  if(!result.success){
    return res.status(400).json({
            error: "invalid input",
            message: result.error.message
          });
  }
try{
  const {email,password}=result.data;
  const {data:authData,error:authError}=await supabase.auth.signInWithPassword({
                                                email:email,
                                                password:password,
                                              });
  if(authError) throw authError;
  return res.status(200).json({
    user_id:authData?.user?.id
  });
}catch(err){
res.status(500).json({
          error:"database error",
          message:err.message
        });
}
}
const signOutUser=async(req,res)=>{
    try{
    const { error } = await supabase.auth.signOut()
    if(error) throw error;
    return res.status(200).json({ message: "Signed out successfully" });
    }catch(err){
        res.status(500).json({
            error:"server error",
            message:err.message
        });
    }
}
module.exports={createUser,updateUser,getUser,signInUser,signOutUser};