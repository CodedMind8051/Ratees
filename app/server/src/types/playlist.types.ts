import { z } from "zod";
import { GetPlaylistsSchema, CreatePlaylistSchema, deletePlaylistSchema, updatePlaylistSchema } from "../validators/playlist.validator";
import mongoose from "mongoose";

export type GetPlaylistsInputType = z.infer<typeof GetPlaylistsSchema>
export type CreatePlaylistInputType = z.infer<typeof CreatePlaylistSchema>
export type DeletePlaylistInputType = z.infer<typeof deletePlaylistSchema>
export type UpdatePlaylistInputType = z.infer<typeof updatePlaylistSchema>

export type PlaylistResponseType = {
    playlistName: string;
    description: string;
    userId: mongoose.Types.ObjectId;
    isPublic: boolean;
    isOwner: boolean;
    totalTracks: number;
    createdAt: Date;
    updatedAt: Date;
};

