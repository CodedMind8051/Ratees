import mongoose, { Schema } from "mongoose";

const UserClubSettingsSchema = new Schema(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "clubId is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId is required"],
    },
    theme: {
      type: String,
      enum: {
        values: ["dark", "light"],
        message: "theme must be one of dark, light",
      },
      default: "dark",
      required: true,
      lowercase: true,
      trim: true,
    },
    notificationOn: {
      type: Boolean,
      default: true,
      required: true,
    },
    lastReadMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One settings doc per user per club
UserClubSettingsSchema.index({ clubId: 1, userId: 1 }, { unique: true });
UserClubSettingsSchema.index({ userId: 1 });
UserClubSettingsSchema.index({ clubId: 1 });

export const UserClubSettings =
  mongoose.models.UserClubSettings ||
  mongoose.model("UserClubSettings", UserClubSettingsSchema);
