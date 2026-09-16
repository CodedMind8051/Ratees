import { objectIdSchema } from "./common.validator"
import z from "zod"

export const deleteRatingSchema = z.object({
    userId: objectIdSchema("userId"),
    ContentId: objectIdSchema("ContentId")
})

export const RateSchema = deleteRatingSchema.extend({
    rating: z.number().int().positive().min(1).max(4, {
        message: "Invalid rating value. Rating must be an integer between 1 and 4."
    })
})

