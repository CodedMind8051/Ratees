import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const MembersOfClubSchema = new Schema(
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
    role: {
      type: String,
      enum: {
        values: ["admin", "moderator", "user"],
        message: "role must be one of admin, moderator, user",
      },
      default: "user",
      required: true,
      lowercase: true,
      trim: true,
    },
    banned: {
      type: Boolean,
      default: false,
      required: true,
    },
    bannedBY: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    bannedReason: {
      type: String,
      trim: true,
      maxlength: [500, "bannedReason cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


MembersOfClubSchema.index({ clubId: 1, userId: 1 }, { unique: true });
MembersOfClubSchema.index({ clubId: 1, role: 1 });
MembersOfClubSchema.index({ userId: 1 });
MembersOfClubSchema.index({ banned: 1 });


// MembersOfClubSchema.pre("validate", function (next: any) {
//   if (this.banned) {
//     if (!this.bannedBY) {
//       return next(new Error("bannedBY is required when banned is true"));
//     }
//     if (!this.bannedReason || this.bannedReason.trim().length === 0) {
//       // allow empty but warn; not blocking
//     }
//   } else {
//     // if not banned, ensure bannedBY and bannedReason are cleared for consistency (optional)
//     // we keep as is but could nullify
//     if (this.bannedBY) {
//       // keep, but ideally null
//     }
//   }
//   next();
// });

(MembersOfClubSchema as any).plugin(mongooseAggregatePaginate);

export const MembersOfClub =
  mongoose.models.MembersOfClub ||
  mongoose.model("MembersOfClub", MembersOfClubSchema);
