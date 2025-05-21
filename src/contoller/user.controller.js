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
        const {email,password,full_name}=req.body;
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
  
}


module.exports={createUser};