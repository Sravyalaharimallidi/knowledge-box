const { z }=require("zod");
const UserSchema=z.object({
    email:z.string().email(),
    password:z.string().min(10),
    full_name:z.string().min(4),
});
module.exports=UserSchema;