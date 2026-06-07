import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default:0
    }
}, { timestamps: true })

const RatingStateSchema = new Schema({
    ContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
        required: true,
        unique: true
    },
    totalNumberOfRatings: {
        type: Number,
        default: 0
    },
    MasterPieceRating: {
        totalCount: {
            type: Number,
            default: 0
        },
    },
    GoodWatchRating: {
        totalCount: {
            type: Number,
            default: 0
        },
    },
    TimePassRating: {
        totalCount: {
            type: Number,
            default: 0
        },
    },
    wasteOfTime: {
        totalCount: {
            type: Number,
            default: 0
        },
    },

}, { timestamps: true })


export const Rate = mongoose.model("Rate", RatingSchema)
export const RatingState = mongoose.model("RatingState", RatingStateSchema)