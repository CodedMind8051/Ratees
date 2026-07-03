import { z } from "zod";
import { objectIdSchema, pageSchema } from "./common.validator";

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