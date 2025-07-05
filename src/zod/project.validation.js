const { z }=require("zod");
const UserSchema=z.object({
    id:z.string().optional(),
    email:z.string().email().optional(),
    password:z.string().min(10).optional(),
    full_name:z.string().min(4).optional(),
});
const CategorySchema=z.object({
    user_id:z.string(),
    name:z.string().min(5),
});
const CardSchema=z.object({
    card_id:z.string().optional(),
    category_id:z.string().optional(),
    title:z.string().min(1).max(100),
    link:z.string().url().optional(),
    content:z.string().optional(),
    description:z.string().optional(),
    is_favorite:z.coerce.boolean(),
    is_public:z.coerce.boolean(),
    user_id:z.string().optional(),
});
const PublicSchema=z.object({
    id:z.string().optional(),
    tags:z.array(z.string()).min(1, "At least one tag is required")
    .max(7, "Maximum 7 tags allowed")
    .refine(tags => new Set(tags).size === tags.length, {
      message: "Tags must be unique"
    })
});
const TagSchema=z.object({
    name:z.string().min(2)
});
module.exports={UserSchema,CategorySchema,CardSchema,PublicSchema,TagSchema};