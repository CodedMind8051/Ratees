import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const ClubJoinRequestSchema = new Schema(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "clubId is required"]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId is required"]
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "status must be one of pending, approved, rejected",
      },
      default: "pending",
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests: one request per user per club
ClubJoinRequestSchema.index({ clubId: 1, userId: 1 }, { unique: true });
ClubJoinRequestSchema.index({ clubId: 1, status: 1 });
ClubJoinRequestSchema.index({ userId: 1, status: 1 });
ClubJoinRequestSchema.index({ createdAt: -1 });

(ClubJoinRequestSchema as any).plugin(mongooseAggregatePaginate);

export const ClubJoinRequest =
  mongoose.models.ClubJoinRequest ||
  mongoose.model("ClubJoinRequest", ClubJoinRequestSchema);
