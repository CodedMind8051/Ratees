import z from "zod"
import { objectIdSchema } from "./common.validator"

export const GetUserSchema = z.object({
    userId: objectIdSchema("userId")
})

export const UpdateUsernameSchema = GetUserSchema.extend({
    username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters")
})

export const UpdatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters")
})
