import { Playlist, PlaylistItem } from "../models/playlist.model";
import { validate } from "../utils/validate.utils";
import { GetPlaylistsSchema, CreatePlaylistSchema, deletePlaylistSchema, updatePlaylistSchema } from "../validators/playlist.validator";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";
import type { GetPlaylistsInputType, PlaylistResponseType, CreatePlaylistInputType, DeletePlaylistInputType, UpdatePlaylistInputType } from "../types/playlist.types";
import mongoose from "mongoose";


export const getPlaylists = async ({ page, userID, OwnerUserId }: GetPlaylistsInputType): Promise<PlaylistResponseType[]> => {

    try {

        const { page: validatedPage, userID: validatedUserID, OwnerUserId: validatedOwnerUserId } = validate(GetPlaylistsSchema, {
            page: page,
            userID: userID,
            OwnerUserId: OwnerUserId
        });

        const aggregate = Playlist.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(validatedUserID),
                },
            },
            {
                $addFields: {
                    isOwner: {
                        $eq: ["$userId", new mongoose.Types.ObjectId(validatedOwnerUserId)]
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { isPublic: true },
                        { isOwner: true }
                    ]
                }
            },
            {

                $sort: {
                    updatedAt: -1,
                }

            },
            {
                $project: {
                    playlistName: 1,
                    description: 1,
                    userId: 1,
                    isPublic: 1,
                    isOwner: 1,
                    totalTracks: 1,
                    createdAt: 1,
                    updatedAt: 1
                },
            }
        ]);

        const playlists = await Playlist.aggregatePaginate(aggregate, {
            page: validatedPage,
            limit: 20,
        });


        if (validatedPage > playlists.totalPages && playlists.totalDocs > 0) {
            throwGraphqlError(
                "Page not found",
                "PAGE_NOT_FOUND",
                404,
                true
            );
        }

        if (!playlists || playlists.totalDocs === 0) {
            throwGraphqlError(
                "No playlists found",
                "PLAYLIST_NOT_FOUND",
                404,
                true
            );
        }


        return playlists.docs;

    } catch (error) {
        return handelGraphqlError(error)
    }
};

export const createPlaylist = async (playlistData: CreatePlaylistInputType): Promise<boolean> => {

    try {

        const {
            playlistName: validatedPlaylistName,
            description: validatedDescription,
            isPublic: validatedIsPublic,
            userId: validatedUserId } = validate(CreatePlaylistSchema, playlistData);

        const existedPlaylist = await Playlist.exists({
            playlistName: validatedPlaylistName,
            userId: new mongoose.Types.ObjectId(validatedUserId)
        });

        if (existedPlaylist) {
            throwGraphqlError("Playlist already exists", "PLAYLIST_ALREADY_EXISTS", 409, true)
        }

        const CreatedPlaylist = await Playlist.create([{
            playlistName: validatedPlaylistName,
            description: validatedDescription,
            isPublic: validatedIsPublic,
            userId: new mongoose.Types.ObjectId(validatedUserId)
        }]);

        if (!CreatedPlaylist || CreatedPlaylist.length === 0) {
            throwGraphqlError("Failed to create playlist", "PLAYLIST_CREATION_FAILED", 500, true)
        }

        return true;

    } catch (error) {
        return handelGraphqlError(error)
    }

}

export const updatePlaylist = async ({
    playlistId,
    userId,
    playlistName,
    description,
    isPublic
}: UpdatePlaylistInputType): Promise<boolean> => {

    const {
        playlistId: validatedPlaylistId,
        userId: validatedUserId,
        playlistName: validatedPlaylistName,
        description: validatedDescription,
        isPublic: validatedIsPublic } = validate(updatePlaylistSchema, {
            playlistId,
            userId,
            playlistName,
            description,
            isPublic
        });

    if (validatedPlaylistName) {
        const existedPlaylist = await Playlist.exists({
            playlistName: validatedPlaylistName,
            userId: new mongoose.Types.ObjectId(validatedUserId)
        });

        if (existedPlaylist) {
            throwGraphqlError("Playlist name already exists", "PLAYLIST_ALREADY_EXISTS", 409, true)
        }
    }

    const playlistUpdated = await Playlist.updateOne({
        _id: new mongoose.Types.ObjectId(validatedPlaylistId),
        userId: new mongoose.Types.ObjectId(validatedUserId)
    }, {
        playlistName: validatedPlaylistName,
        description: validatedDescription,
        isPublic: validatedIsPublic
    });

    if (playlistUpdated.matchedCount === 0) {
        throwGraphqlError("Playlist not found", "PLAYLIST_NOT_FOUND", 404, true)
    }

    if (playlistUpdated.modifiedCount === 0 || !playlistUpdated.acknowledged || !playlistUpdated) {
        throwGraphqlError("Failed to update playlist", "PLAYLIST_UPDATE_FAILED", 500, true)
    }

    return true
}

export const deletePlaylist = async ({ playlistId, userId }: DeletePlaylistInputType): Promise<boolean> => {

    const session = await mongoose.startSession();
    try {

        await session.startTransaction();

        const { playlistId: validatedPlaylistId, userId: validatedUserId } = validate(deletePlaylistSchema, { playlistId, userId });

        const playlistDeleted = await Playlist.deleteOne({
            _id: new mongoose.Types.ObjectId(validatedPlaylistId),
            userId: new mongoose.Types.ObjectId(validatedUserId)
        }, {
            session: session
        });

        await PlaylistItem.deleteMany({
            playlistId: new mongoose.Types.ObjectId(validatedPlaylistId)
        }, {
            session: session
        });

        if (playlistDeleted.deletedCount === 0) {
            throwGraphqlError("Playlist not exists..", "NOT_FOUND", 404, true)
        }

        await session.commitTransaction();

        return true;

    } catch (error) {
        await session.abortTransaction();
        return handelGraphqlError(error)
    } finally {
        await session.endSession();
    }

}
