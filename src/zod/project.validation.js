const { z }=require("zod");
const UserSchema=z.object({
    id:z.string(),
    email:z.string().email().optional(),
    full_name:z.string().min(4),
});
const CategorySchema=z.object({
    name:z.string().min(5),
});
module.exports={UserSchema,CategorySchema};