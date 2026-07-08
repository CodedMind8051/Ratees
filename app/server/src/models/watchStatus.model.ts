import mongoose, { Schema } from "mongoose";
import { WatchStatusEnum } from "../types/watchStatus.types";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";




const watchStatusSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        contentId: {
            type: Schema.Types.ObjectId,
            ref: "Content",
            required: true,
            index: true,
        },

        watchStatus: {
            type: String,
            enum: Object.values(WatchStatusEnum),
            default: WatchStatusEnum.WATCH_LATER,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


watchStatusSchema.index(
    { userId: 1, contentId: 1 },
    { unique: true }
);


watchStatusSchema.plugin(mongooseAggregatePaginate)

export const WatchStatus =mongoose.model("WatchStatus", watchStatusSchema);