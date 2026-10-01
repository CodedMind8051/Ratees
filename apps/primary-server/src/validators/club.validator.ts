import { z } from "zod";
import { objectIdSchema, pageSchema } from "@ratees/validators";

export const createClubSchema = z.object({
    name: z.string().trim().min(3, "Club name must be at least 3 characters").max(100, "Club name cannot exceed 100 characters").regex(/^[a-zA-Z0-9\s'-]+$/, "Invalid club name"),
    description: z.string().trim().max(1000, "Description cannot exceed 1000 characters").regex(/^[a-zA-Z0-9\s'-]+$/, "Invalid description").optional().default(""),
    password: z.string().trim().min(8, "Password must be at least 8 characters").max(100, "Password cannot exceed 100 characters").optional().nullable().default(null),
    thumbnail: z.url({ error: "Thumbnail must be a valid URL" })
        .optional()
        .nullable()
        .default(null),
    ispublic: z.boolean(),
    maxMemberLimit: z.number().int("maxMemberLimit must be an integer").min(1, "maxMemberLimit must be at least 1").max(10000, "maxMemberLimit cannot exceed 10000").optional().default(50),
    userId: objectIdSchema("userId")
})

export const updateClubSchema = z.object({
    clubId: objectIdSchema("clubId"),
    userId: objectIdSchema("userId"),
    name: z.string().trim().min(3, "Club name must be at least 3 characters").max(100, "Club name cannot exceed 100 characters").optional(),
    description: z.string().trim().max(1000, "Description cannot exceed 1000 characters").optional(),
    password: z.string().trim().min(8, "Password must be at least 8 characters").max(100, "Password cannot exceed 100 characters").optional().nullable(),
    thumbnail: z.string().trim().url("Thumbnail must be a valid URL").optional().nullable(),
    ispublic: z.boolean().optional(),
    maxMemberLimit: z.number().int("maxMemberLimit must be an integer").min(1, "maxMemberLimit must be at least 1").max(10000, "maxMemberLimit cannot exceed 10000").optional()
})
.superRefine((data, ctx) => {
     if (data.ispublic===false && !data.password) {
        ctx.addIssue({
            code:"custom",
            message: "If ispublic is false, password must be provided",
            path: ["password"]
        })
     }else if (data.ispublic===true && data.password) {
        ctx.addIssue({
            code: "custom",
            message: "If ispublic is true, password must not be provided",
            path: ["password"]
        })}
})
.refine((data) => {
    return data.name !== undefined || data.description !== undefined || data.password !== undefined || data.thumbnail !== undefined || data.ispublic !== undefined || data.maxMemberLimit !== undefined;
}, {
    message: "At least one field must be provided to update"
});

export const deleteClubSchema = z.object({
    clubId: objectIdSchema("clubId"),
    userId: objectIdSchema("userId")
})

export const getClubSchema = z.object({
    clubId: objectIdSchema("clubId")
})

export const searchClubsSchema = z.object({
    searchTerm: z
    .string()
    .trim()
    .min(1, "Search query must be at least 1 character")
    .max(100, "Search query cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s'-]+$/, "Invalid search query")
    .optional().default(""),
    page: pageSchema
})
