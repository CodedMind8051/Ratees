import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist, getPlaylistItems, createPlaylistItem, deletePlaylistItem } from "../../controllers/playlist.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import type { MyContextType } from "../../types/graphql.types";
import type { GetPlaylistsInputType, CreatePlaylistInputType, UpdatePlaylistInputType, DeletePlaylistInputType, GetPlaylistItemsInputType, PlaylistsItemsInputType } from "../../types/playlist.types";

export const playlistResolver = {
    Query: {
        getPlaylists: async (_: any,
            {
                page,
                userID
            }: GetPlaylistsInputType,
            context: MyContextType
        ) => {

            const RequestUserId = (context?.req?.session as any)?.session?.userId

            const playlists = await getPlaylists({ page, userID, RequestUserId })
            return playlists
        },
        getPlaylistItems: async (_: any,
            {
                playlistId,
                page
            }: GetPlaylistItemsInputType,
            context: MyContextType
        ) => {

            const RequestUserId = (context?.req?.session as any)?.session?.userId

            const playlistItems = await getPlaylistItems({ playlistId, RequestUserId, page })
            return playlistItems
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
        },
        createPlaylistItem: async (_: any,
            {
                contentId,
                playlistId
            }: PlaylistsItemsInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await createPlaylistItem({ contentId, playlistId, userId })
            return result
        },
        deletePlaylistItem: async (_: any,
            {
                contentId,
                playlistId
            }: PlaylistsItemsInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await deletePlaylistItem({ contentId, playlistId, userId })
            return result
        }
    }
}