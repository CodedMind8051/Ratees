import { z } from "zod";
import { GetPlaylistsSchema, CreatePlaylistSchema, deletePlaylistSchema, updatePlaylistSchema, PlaylistsItemsSchema, getPlaylistItemsSchema } from "../validators/playlist.validator";
import mongoose from "mongoose";

export type GetPlaylistsInputType = z.infer<typeof GetPlaylistsSchema>
export type CreatePlaylistInputType = z.infer<typeof CreatePlaylistSchema>
export type DeletePlaylistInputType = z.infer<typeof deletePlaylistSchema>
export type UpdatePlaylistInputType = z.infer<typeof updatePlaylistSchema>
export type PlaylistsItemsInputType = z.infer<typeof PlaylistsItemsSchema>
export type GetPlaylistItemsInputType = z.infer<typeof getPlaylistItemsSchema>

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

export type PlaylistItemResponseType = {
    _id: string;
    contentId: string;
    title: string;
    genre: [string];
    Content_Type: string;
    runtime: string;
    release_date: string;
    poster: string;
    updatedAt?: string;
};

