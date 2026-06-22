import { z } from "zod";
import { objectIdSchema } from "./globle.validator";


export const pageSchema = z
    .number({
        error: "Page number is required"
    })
    .int("Page number must be an integer")
    .positive("Page number must be greater than 0")


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
    page: pageSchema
});

export const ContentDetailsInputSchema = z.object({
    ContentId: objectIdSchema("ContentId")
})


export const FetchContentsForHomepageSchema = z.object({
    page: pageSchema
})


