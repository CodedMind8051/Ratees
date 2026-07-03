import { getPlaylists } from "../../controllers/playlist.controller";
import type { MyContextType } from "../../types/graphql.types";
import type { GetPlaylistsInputType } from "../../types/playlist.types";

export const PlaylistResolver = {
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
    }
}