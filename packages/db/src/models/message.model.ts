import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const MessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId is required"]
    },
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "clubId is required"]
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, "message cannot exceed 2000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["sending", "sent", "delivered", "received", "failed"],
        message: "status must be one of sending, sent, delivered, received, failed",
      },
      default: "sending",
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    replyMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    containMedia: {
      type: Boolean,
      default: false,
      required: true,
    },
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for chat pagination
MessageSchema.index({ clubId: 1, createdAt: -1 });
MessageSchema.index({ clubId: 1, deleted: 1, createdAt: -1 });
MessageSchema.index({ userId: 1 });
MessageSchema.index({ replyMessageId: 1 });

// Validations
MessageSchema.pre("validate", function (next: any) {
  // If deleted, no need for message/media checks
  if (this.deleted) return next();

  // If containMedia true, mediaId is required
  if (this.containMedia && !this.mediaId) {
    return next(new Error("mediaId is required when containMedia is true"));
  }

  // If containMedia false, mediaId should be null (cleanup)
  if (!this.containMedia && this.mediaId) {
    // allow but ideally null; we can keep but warn
  }

  // At least message or media must exist
  const hasMessage = this.message && this.message.trim().length > 0;
  if (!hasMessage && !this.containMedia) {
    return next(new Error("Either message or media must be provided"));
  }

  // replyMessageId cannot be self
  if (this.replyMessageId && this.replyMessageId.equals(this._id as any)) {
    return next(new Error("replyMessageId cannot be same as message id"));
  }

  next();
});

(MessageSchema as any).plugin(mongooseAggregatePaginate);

export const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
