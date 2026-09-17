import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { hashPassword } from "@ratees/utils/src/bcrypt.utils.js"


const ClubSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
      minlength: [3, "Club name must be at least 3 characters"],
      maxlength: [100, "Club name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    password: {
      type: String,
      trim: true,
      default: null,
      select: false,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v: string | null) {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Thumbnail must be a valid URL",
      },
    },
    ispublic: {
      type: Boolean,
      default: true,
      required: true,
    },
    maxMemberLimit: {
      type: Number,
      required: [true, "maxMemberLimit is required"],
      default: 50,
      min: [1, "maxMemberLimit must be at least 1"],
      max: [10000, "maxMemberLimit cannot exceed 10000"],
      validate: {
        validator: Number.isInteger,
        message: "maxMemberLimit must be an integer",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ClubSchema.index({ ispublic: 1 });
ClubSchema.index({ name: 1 });
ClubSchema.index({ createdAt: -1 });


ClubSchema.pre("save", async function () {

  try {

    if(!this.password && (this.isModified("password") || this.isNew) && !this.ispublic) {
      throw new Error("Password is required");
    }
    
    if (this.password && !this.ispublic && (this.isModified("password") || this.isNew)) {
      this.password = await hashPassword(this.password as string);
    }

  } catch (error) {
    throw error;
  }
});

(ClubSchema as any).plugin(mongooseAggregatePaginate);

export const Club = mongoose.models.Club || mongoose.model("Club", ClubSchema);
