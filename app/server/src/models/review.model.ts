import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const ReviewSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ContentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Content",
            required: true
        },
        review: {
            type: String,
            required: true,
            maxLength: [1000, "Comment cannot exceed 1000 characters"]
        }
    },
    {
        timestamps: true
    }
)

ReviewSchema.plugin(mongooseAggregatePaginate)

export const Review = mongoose.model("Review", ReviewSchema)