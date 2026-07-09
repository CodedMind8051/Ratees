import { Playlist, PlaylistItem } from "../models/playlist.model";
import { Content } from "../models/content.model";
import { validate } from "../utils/validate.utils";
import { GetPlaylistsSchema, CreatePlaylistSchema, deletePlaylistSchema, updatePlaylistSchema, PlaylistsItemsSchema, getPlaylistItemsSchema } from "../validators/playlist.validator";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";
import type { GetPlaylistsInputType, PlaylistResponseType, CreatePlaylistInputType, DeletePlaylistInputType, UpdatePlaylistInputType, PlaylistsItemsInputType, GetPlaylistItemsInputType, PlaylistItemResponseType } from "../types/playlist.types";
import mongoose from "mongoose";


export const getPlaylists = async ({ page, userID, RequestUserId }: GetPlaylistsInputType) => {

    try {

        const { page: validatedPage, userID: validatedUserID, RequestUserId: validatedRequestUserId } = validate(GetPlaylistsSchema, {
            page: page,
            userID: userID,
            RequestUserId: RequestUserId
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
                        $eq: ["$userId", new mongoose.Types.ObjectId(validatedRequestUserId)]
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
            // Lookup first playlist item to get cover image
            {
                $lookup: {
                    from: "playlistitems",
                    let: { playlistId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$playlistId", "$$playlistId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: "contents",
                                localField: "contentId",
                                foreignField: "_id",
                                as: "content"
                            }
                        },
                        { $unwind: { path: "$content", preserveNullAndEmptyArrays: true } },
                        { $project: { poster: "$content.poster" } }
                    ],
                    as: "firstItem"
                }
            },
            {
                $addFields: {
                    coverImage: {
                        $cond: {
                            if: { $gt: [{ $size: "$firstItem" }, 0] },
                            then: { $arrayElemAt: ["$firstItem.poster", 0] },
                            else: null
                        }
                    }
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
                    coverImage: 1,
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

        // Return empty array instead of error when no playlists exist
        if (!playlists || playlists.totalDocs === 0) {
            return {
                playlists: [],
                totalPages: 0,
                totalDocs: 0,
                currentPage: validatedPage
            };
        }


        return {
            playlists: playlists.docs,
            totalPages: playlists.totalPages,
            totalDocs: playlists.totalDocs,
            currentPage: playlists.page
        };

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

    const existingPlaylist = await Playlist.exists({
        playlistName: validatedPlaylistName,
        userId: new mongoose.Types.ObjectId(validatedUserId),
        _id: { $ne: new mongoose.Types.ObjectId(validatedPlaylistId) },
    });

    if (existingPlaylist) {
        throwGraphqlError(
            "You already have a playlist with this name.",
            "PLAYLIST_NAME_ALREADY_EXISTS",
            409,
            true
        );
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

    if (!playlistUpdated.acknowledged || !playlistUpdated) {
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

export const getPlaylistItems = async ({ playlistId, RequestUserId, page }: GetPlaylistItemsInputType) => {
    try {

        const { playlistId: validatedPlaylistId, RequestUserId: validatedRequestUserId, page: validatedPage } = validate(getPlaylistItemsSchema, {
            playlistId,
            RequestUserId,
            page
        })

        const isShowPlaylistItemsTrue = await Playlist.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(validatedPlaylistId),
                }
            },
            {
                $addFields: {
                    isOwner: {
                        $eq: ["$userId", new mongoose.Types.ObjectId(validatedRequestUserId)]
                    }
                }
            }, {
                $match: {
                    $or: [
                        { isPublic: true },
                        { isOwner: true }
                    ]
                }
            }

        ]
        )

        if (!isShowPlaylistItemsTrue || isShowPlaylistItemsTrue.length === 0) {
            throwGraphqlError("Playlist not found or you don't have permission to view the items", "PLAYLIST_NOT_FOUND_OR_NO_PERMISSION", 404, true)
        }

        const aggregatedResult = PlaylistItem.aggregate([
            {
                $match: {
                    playlistId: new mongoose.Types.ObjectId(validatedPlaylistId)
                }
            },
            {
                $lookup: {
                    from: "contents",
                    localField: "contentId",
                    foreignField: "_id",
                    as: "content"
                }
            },
            {
                $unwind: {
                    path: "$content",
                    preserveNullAndEmptyArrays: false

                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    contentId: "$contentId",
                    title: "$content.title",
                    genre: "$content.genre",
                    Content_Type: "$content.Content_Type",
                    runtime: "$content.runtime",
                    release_date: "$content.release_date",
                    poster: "$content.poster",
                    updatedAt: 1
                }
            }
        ])

        const options = {
            page: validatedPage || 1,
            limit: 40
        }

        const playlistItems = await PlaylistItem.aggregatePaginate(aggregatedResult, options);

        if (validatedPage > playlistItems.totalPages && playlistItems.totalDocs > 0) {
            throwGraphqlError(
                "Page not found",
                "PAGE_NOT_FOUND",
                404,
                true
            );
        }

        // Return empty array instead of error when no items exist
        if (!playlistItems || playlistItems.totalDocs === 0) {
            return {
                items: [],
                totalPages: 0,
                totalDocs: 0,
                currentPage: validatedPage
            };
        }

        return {
            items: playlistItems.docs,
            totalPages: playlistItems.totalPages,
            totalDocs: playlistItems.totalDocs,
            currentPage: playlistItems.page
        };

        return playlistItems.docs;

    } catch (error) {
        return handelGraphqlError(error)
    }

}

export const createPlaylistItem = async ({
    contentId,
    userId,
    playlistId
}: PlaylistsItemsInputType): Promise<boolean> => {

    try {

        const { contentId: validatedContentId, playlistId: validatedPlaylistId, userId: validatedUserId } = validate(
            PlaylistsItemsSchema, {
            contentId,
            userId,
            playlistId
        })


        const isPlaylistExists = await Playlist.exists({
            _id: new mongoose.Types.ObjectId(validatedPlaylistId),
            userId: new mongoose.Types.ObjectId(validatedUserId)
        })

        if (!isPlaylistExists) {
            throwGraphqlError("Playlist not found", "PLAYLIST_NOT_FOUND", 404, true)
        }

        const isContentExists = await Content.exists({
            _id: new mongoose.Types.ObjectId(validatedContentId)
        })

        if (!isContentExists) {
            throwGraphqlError("Movie/WebSeries not found", "CONTENT_NOT_FOUND", 404, true)
        }

        const existedDuplicatePlaylistItems = await PlaylistItem.exists({
            contentId: new mongoose.Types.ObjectId(validatedContentId),
            playlistId: new mongoose.Types.ObjectId(validatedPlaylistId)
        })

        if (existedDuplicatePlaylistItems) {
            throwGraphqlError("This movie/WebSeries already exists", "PLAYLIST_ITEM_ALREADY_EXISTS", 409, true)
        }

        const createdPlaylistItem = await PlaylistItem.create({
            contentId: new mongoose.Types.ObjectId(validatedContentId),
            playlistId: new mongoose.Types.ObjectId(validatedPlaylistId)
        })

        if (!createdPlaylistItem) {
            throwGraphqlError("Failed to add movie/WebSeries to playlist", "PLAYLIST_ITEM_CREATION_FAILED", 500, true)
        }

        // Update totalTracks count
        await Playlist.updateOne(
            { _id: new mongoose.Types.ObjectId(validatedPlaylistId) },
            { $inc: { totalTracks: 1 } }
        );

        return true;

    } catch (error) {
        return handelGraphqlError(error)

    }
}

export const deletePlaylistItem = async (
    {
        playlistId,
        userId,
        contentId
    }: PlaylistsItemsInputType

): Promise<boolean> => {

    try {

        const { contentId: validatedContentId, playlistId: validatedPlaylistId, userId: validatedUserId } = validate(
            PlaylistsItemsSchema, {
            contentId,
            userId,
            playlistId
        })

        const isPlaylistExists = await Playlist.exists({
            _id: new mongoose.Types.ObjectId(validatedPlaylistId),
            userId: new mongoose.Types.ObjectId(validatedUserId)
        })

        if (!isPlaylistExists) {
            throwGraphqlError("Playlist not found", "PLAYLIST_NOT_FOUND", 404, true)
        }

        const deletePlaylistItem = await PlaylistItem.deleteOne({
            contentId: new mongoose.Types.ObjectId(validatedContentId),
            playlistId: new mongoose.Types.ObjectId(validatedPlaylistId)
        })

        if (deletePlaylistItem.deletedCount === 0) {
            throwGraphqlError("Movie/WebSeries not found in playlist", "PLAYLIST_ITEM_NOT_FOUND", 404, true)
        }

        // Update totalTracks count
        await Playlist.updateOne(
            { _id: new mongoose.Types.ObjectId(validatedPlaylistId) },
            { $inc: { totalTracks: -1 } }
        );

        return true

    } catch (error) {
        return handelGraphqlError(error)
    }

}