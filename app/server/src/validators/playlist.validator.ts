import { z } from "zod";
import { objectIdSchema, pageSchema } from "./common.validator";
import { User } from "../models/user.model";

export const GetPlaylistsSchema = z.object({
    page: pageSchema,
    userID: objectIdSchema("userID"),
    OwnerUserId: objectIdSchema("OwnerUserId").optional()
});

export const CreatePlaylistSchema = z.object({
    playlistName: z.string().min(1, "Playlist name is required").max(100, "Playlist name must be less than 100 characters"),
    description: z.string().max(500, "Description must be less than 500 characters").optional().default(""),
    isPublic: z.boolean(),
    userId: objectIdSchema("userId")
})

export const updatePlaylistSchema = z.object({
    playlistId: objectIdSchema("playlistId"),
    userId: objectIdSchema("userId"),
    playlistName: z.string().min(1, "Playlist name is required").max(100, "Playlist name must be less than 100 characters").optional(),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    isPublic: z.boolean().optional()
}).refine((data) => {
    return data.playlistName !== undefined || data.description !== undefined || data.isPublic !== undefined;
}, {
    message: "At least one field must be provided to update"
});

export const deletePlaylistSchema = z.object({
    playlistId: objectIdSchema("playlistId"),
    userId: objectIdSchema("userId")
})

