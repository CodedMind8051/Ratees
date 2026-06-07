import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = (fieldName: string) => {
    return z.string().refine(
        Types.ObjectId.isValid, {
        message: `Invalid ${fieldName}`
    }
    )
}


export const SearchContentsSchema = z.object({
    query: z
        .string()
        .trim()
        .min(1,
            "Search query is required"
        )
        .max(
            100,
            "Your search query is too long. Please keep it under 100 characters."
        )
        .regex(
            /^[a-zA-Z0-9\s'-]+$/,
            "Invalid search query"
        ),
    page: z
        .number({
            error: "Page number is required"
        })
        .int("Page number must be an integer")
        .positive("Page number must be greater than 0")
});

export const SearchContentDetailsSchema = z.object({
    ContentId: objectIdSchema("ContentId")
})


export const RateSchema = z.object({
    userId: objectIdSchema("userId"),
    ContentId: objectIdSchema("ContentId"),
    rating: z.number().int().positive().min(1).max(5, {
        message: "Invalid rating value. Rating must be an integer between 1 and 5."
    })
})

