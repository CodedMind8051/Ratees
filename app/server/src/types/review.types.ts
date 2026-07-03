import { z } from "zod";
import { SubmitReviewSchema, deleteReviewSchema, updateReviewSchema, getReviewsSchema } from "../validators/review.validator";
import mongoose from "mongoose";

export type SubmitReviewType = z.infer<typeof SubmitReviewSchema>
export type deleteReviewType = z.infer<typeof deleteReviewSchema>
export type updateReviewType = z.infer<typeof updateReviewSchema>
export type getReviewsInputType = z.infer<typeof getReviewsSchema>


export type ReviewsDetailsDataType = {
    _id: mongoose.Types.ObjectId,
    review: String,
    createdAt: Date,
    userId: mongoose.Types.ObjectId,
    username: String,
    userEmail: String,
    profileImage: String
}