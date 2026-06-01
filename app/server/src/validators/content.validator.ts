import { z } from "zod";

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

export type SearchContentInput =
    z.infer<typeof SearchContentsSchema>;