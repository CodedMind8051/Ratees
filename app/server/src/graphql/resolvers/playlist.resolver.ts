import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist } from "../../controllers/playlist.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import type { MyContextType } from "../../types/graphql.types";
import type { GetPlaylistsInputType, CreatePlaylistInputType, UpdatePlaylistInputType, DeletePlaylistInputType } from "../../types/playlist.types";

export const playlistResolver = {
    Query: {
        getPlaylists: async (_: any,
            {
                page,
                userID
            }: GetPlaylistsInputType,
            context: MyContextType
        ) => {

            const OwnerUserId = (context?.req?.session as any)?.session?.userId

            const playlists = await getPlaylists({ page, userID, OwnerUserId })
            return playlists
        }
    },
    Mutation: {
        createPlaylist: async (_: any,
            {
                playlistName,
                description,
                isPublic
            }: CreatePlaylistInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await createPlaylist({ playlistName, description, isPublic, userId })
            return result
        },
        updatePlaylist: async (_: any,
            {
                playlistId,
                playlistName,
                description,
                isPublic
            }: UpdatePlaylistInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await updatePlaylist({ playlistId, userId, playlistName, description, isPublic })
            return result
        },
        deletePlaylist: async (_: any,
            {
                playlistId
            }: DeletePlaylistInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await deletePlaylist({ playlistId, userId })
            return result
        }
    }
}