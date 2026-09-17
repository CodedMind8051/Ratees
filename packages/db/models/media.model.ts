import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const MediaSchema = new Schema(
  {
    mediaUrl: {
      type: String,
      required: [true, "mediaUrl is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "mediaUrl must be a valid URL",
      },
    },
    mediaType: {
      type: String,
      enum: {
        values: ["image", "video"],
        message: "mediaType must be one of image, video",
      },
      required: [true, "mediaType is required"],
      lowercase: true,
      trim: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ mediaType: 1, deleted: 1 });

(MediaSchema as any).plugin(mongooseAggregatePaginate);

export const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);
