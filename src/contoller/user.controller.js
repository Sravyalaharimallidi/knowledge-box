const {supabase}=require("../db/db");
const UserSchema=require("../zod/project.validation");
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
        const { data:authData,error:authError} = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name,
            }
          }
        });
        if(authError) throw authError;
        const {error:dbError}=await supabase
                                    .from('users')
                                    .insert([{
                                        id:authData.user.id,
                                        email:email,
                                        full_name:full_name,
                                        created_at:new Date().toISOString()
                                    }])
                                    .select();
        if(dbError) throw dbError;
      res.status(201).json({
        message:"user created"
      });}catch(err){                          
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
        const {email,password,full_name}=result.data;
        const {data:authData,error:authError}=await supabase.auth.signInWithPassword({
          email,
          password
        });
        if(authError) throw authError;

        const {error:dbError}=await supabase.auth.updateUser({
          email:email,
          data: {full_name:full_name}
        });
        if(dbError) throw dbError;
        const { error:error } = await supabase
  .from('users')
  .update({ full_name: full_name })
  .eq('id', authData.user.id);
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


module.exports={createUser,updateUser};