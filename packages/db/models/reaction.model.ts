import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const ReactionSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: [true, "messageId is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId is required"]
    },
    reaction: {
      type: String,
      required: [true, "reaction is required"],
      trim: true,
      minlength: [1, "reaction cannot be empty"],
      maxlength: [10, "reaction cannot exceed 10 characters"],
      // Only emoji / image identifier - allow any short string, but prevent long text
      validate: {
        validator: function (v: string) {
          return v.trim().length > 0;
        },
        message: "reaction must be a valid emoji or image identifier",
      },
    },
  },
  {
    timestamps: true,
  }
);

// One reaction per user per message (user can change reaction, not duplicate)
ReactionSchema.index({ messageId: 1, userId: 1 }, { unique: true });
ReactionSchema.index({ messageId: 1 });
ReactionSchema.index({ userId: 1 });
ReactionSchema.index({ createdAt: -1 });

(ReactionSchema as any).plugin(mongooseAggregatePaginate);

export const Reaction = mongoose.models.Reaction || mongoose.model("Reaction", ReactionSchema);
// Also export as MessageReaction for alias
export const ReactionToMessage = Reaction;
