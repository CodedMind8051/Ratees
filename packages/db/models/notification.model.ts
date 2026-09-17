import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId is required"]
    },
    type: {
      type: String,
      enum: {
        values: [
          "clubInvite",
          "ClubJoinRequestStatus",
          "ClubJoinRequest",
          "clubCallInvite",
          "reply",
          "trendingMovieLists",
        ],
        message:
          "type must be one of clubInvite, ClubJoinRequestStatus, ClubJoinRequest, clubCallInvite, reply, trendingMovieLists",
      },
      required: [true, "type is required"],
      trim: true
    },
    data: {
      type: Schema.Types.Mixed,
      required: [true, "data is required"],
      validate: {
        validator: function (v: any) {
          if (!v || typeof v !== "object" || Array.isArray(v)) return false;
          // must contain message:string
          if (typeof v.message !== "string" || v.message.trim().length === 0) return false;
          if (v.message.length > 1000) return false;
          return true;
        },
        message:
          "data must be an object containing required message:string (max 1000 chars) and may contain any other key-value pairs",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["sentToQue", "delivered", "failed"],
        message: "status must be one of sentToQue, delivered, failed",
      },
      default: "sentToQue",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fetching user notifications efficiently
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ createdAt: -1 });

(NotificationSchema as any).plugin(mongooseAggregatePaginate);

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
