import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const playlistSchema = new mongoose.Schema(
    {
        playlistName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
            unique: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        isPublic: {
            type: Boolean,
            default: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        totalTracks: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);


const playlistItemSchema = new mongoose.Schema(
    {
        playlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Playlist",
            required: true,
            index: true,
        },

        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Content",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);



playlistSchema.index({ userId: 1, createdAt: -1 });
playlistItemSchema.index({ playlistId: 1, createdAt: 1 });


playlistItemSchema.index(
    { playlistId: 1, contentId: 1 },
    { unique: true }
);
playlistSchema.index(
    {
        userId: 1,
        playlistName: 1
    },
    {
        unique: true
    });

playlistSchema.plugin(mongooseAggregatePaginate);
playlistItemSchema.plugin(mongooseAggregatePaginate);

const Playlist = mongoose.model("Playlist", playlistSchema);
const PlaylistItem = mongoose.model("PlaylistItem", playlistItemSchema);

export { Playlist, PlaylistItem };