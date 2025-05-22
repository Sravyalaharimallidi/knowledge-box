const { z }=require("zod");
const UserSchema=z.object({
    id:z.string().optional(),
    email:z.string().email().optional(),
    password:z.string().min(10).optional(),
    full_name:z.string().min(4),
});
const CategorySchema=z.object({
    id:z.string().optional(),
    email:z.string().email().optional(),
    password:z.string().min(10).optional(),
    name:z.string().min(5),
});
module.exports={UserSchema,CategorySchema};