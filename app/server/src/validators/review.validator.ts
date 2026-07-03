import { z } from "zod"
import { objectIdSchema, pageSchema } from "./common.validator"

export const SubmitReviewSchema = z.object({
    userId: objectIdSchema("userId"),
    ContentId: objectIdSchema("ContentId"),
    review: z.string().min(2, "Comment at least contain 2 letters.").max(1000, "Comment cannot exceed 1000 characters.")
})

export const getReviewsSchema = z.object({
    ContentId: objectIdSchema("ContentId"),
    userId: objectIdSchema("userId").optional(),
    page: pageSchema
})

export const updateReviewSchema = z.object({
    userId: objectIdSchema("userId"),
    reviewId: objectIdSchema("reviewId"),
    review: z.string().min(2, "Comment at least contain 2 letters.").max(1000, "Comment cannot exceed 1000 characters.")
})

export const deleteReviewSchema = z.object({
    reviewId: objectIdSchema("reviewId"),
    userId: objectIdSchema("userId")
})



