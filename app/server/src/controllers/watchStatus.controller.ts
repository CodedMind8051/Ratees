import { WatchStatus } from "../models/watchStatus.model";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";
import { validate } from "../utils/validate.utils"
import { WatchStatusIdentifierInputSchema, submitWatchStatusOfContentInputSchema, getContentListInWatchStatusInputSchema } from "../validators/watchStatus.validator"
import type { WatchStatusIdentifierInputType, submitWatchStatusOfContentInputType, getContentListInWatchStatusInputType, getContentListInWatchStatusResponseType } from "../types/watchStatus.types"
import mongoose from "mongoose";

export const getWatchStatusOfContent = async ({ userId, contentId }: WatchStatusIdentifierInputType) => {
    try {

        const { userId: verifiedUserid, contentId: verifiedContentId } = validate(WatchStatusIdentifierInputSchema, {
            userId,
            contentId
        })

        const watchStatus = await WatchStatus.findOne({
            userId: new mongoose.Types.ObjectId(verifiedUserid),
            contentId: new mongoose.Types.ObjectId(verifiedContentId)
        }).select("watchStatus");

        return watchStatus

    } catch (error) {
        return handelGraphqlError(error);
    }
}

export const submitWatchStatusOfContent = async ({
    userId,
    contentId,
    watchStatus
}: submitWatchStatusOfContentInputType): Promise<boolean> => {

    try {

        const { userId: verifiedUserId, contentId: verifiedContentId, watchStatus: verifiedWatchStatus } = validate(submitWatchStatusOfContentInputSchema, {
            userId,
            contentId,
            watchStatus
        })

        const isWatchStatusExists = await WatchStatus.exists({
            userId: new mongoose.Types.ObjectId(verifiedUserId),
            contentId: new mongoose.Types.ObjectId(verifiedContentId)
        })

        if (isWatchStatusExists) {
            const result = await updateWatchStatusOfContent({ userId: verifiedUserId, contentId: verifiedContentId, watchStatus: verifiedWatchStatus })
            return result
        }

        const submitWatchStatus = await WatchStatus.create({
            userId: new mongoose.Types.ObjectId(verifiedUserId),
            contentId: new mongoose.Types.ObjectId(verifiedContentId),
            watchStatus: verifiedWatchStatus
        })

        if (!submitWatchStatus) {
            throwGraphqlError("Failed to save watch status.", "WATCH_STATUS_CREATION_FAILED", 500, true)
        }

        return true

    } catch (error) {
        return handelGraphqlError(error)
    }
}

export const updateWatchStatusOfContent = async ({
    userId,
    contentId,
    watchStatus
}: submitWatchStatusOfContentInputType): Promise<boolean> => {
    try {

        const { userId: verifiedUserId, contentId: verifiedContentId, watchStatus: verifiedWatchStatus } = validate(submitWatchStatusOfContentInputSchema, {
            userId,
            contentId,
            watchStatus
        })


        console.log(verifiedContentId)


        const updateWatchStatus = await WatchStatus.updateOne(
            {
                userId: new mongoose.Types.ObjectId(verifiedUserId),
                contentId: new mongoose.Types.ObjectId(verifiedContentId)
            },
            {
                $set: {
                    watchStatus: verifiedWatchStatus
                }
            }
        )

        console.log({
            verifiedUserId,
            verifiedContentId,
            verifiedWatchStatus,
            updateWatchStatus
        });


        const doc = await WatchStatus.findOne({
            userId: new mongoose.Types.ObjectId(verifiedUserId),
            contentId: new mongoose.Types.ObjectId(verifiedContentId),
        });

        console.log(doc);
        if (updateWatchStatus.matchedCount === 0) {
            throwGraphqlError("Watch status not found.", "WATCH_STATUS_NOT_FOUND", 404, true)
        }

        if (!updateWatchStatus.acknowledged) {
            throwGraphqlError("Failed to update watch status.", "WATCH_STATUS_UPDATE_FAILED", 500, true)
        }

        return true
    } catch (error) {
        return handelGraphqlError(error)
    }
}

export const deleteWatchStatusOfContent = async ({
    userId,
    contentId
}: WatchStatusIdentifierInputType): Promise<boolean> => {

    try {

        const { userId: verifiedUserid, contentId: verifiedContentId } = validate(WatchStatusIdentifierInputSchema, {
            userId,
            contentId
        })

        const deletedWatchStatus = await WatchStatus.deleteOne({
            userId: new mongoose.Types.ObjectId(verifiedUserid),
            contentId: new mongoose.Types.ObjectId(verifiedContentId)
        })

        if (deletedWatchStatus.deletedCount === 0) {
            throwGraphqlError("Watch status not found.", "WATCH_STATUS_NOT_FOUND", 404, true)
        }

        if (!deletedWatchStatus.acknowledged) {
            throwGraphqlError("Failed to Delete watch status.", "WATCH_STATUS_DELETE_FAILED", 500, true)
        }

        return true

    } catch (error) {
        return handelGraphqlError(error)
    }

}

export const getContentListInWatchStatus = async ({
    userId,
    RequestUserId,
    watchStatus,
    page
}: getContentListInWatchStatusInputType): Promise<getContentListInWatchStatusResponseType[]> => {

    try {

        const { userId: verifiedUserid, RequestUserId: verifiedRequestUserId, watchStatus: verifiedWatchStatus, page: verifiedPage } = validate(getContentListInWatchStatusInputSchema, {
            userId,
            RequestUserId,
            watchStatus,
            page
        })

        const aggregatedResult = WatchStatus.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(verifiedUserid),
                    watchStatus: verifiedWatchStatus
                }
            },
            {
                $addFields: {
                    isOwner: {
                        $eq: ["$userId", new mongoose.Types.ObjectId(verifiedRequestUserId)]
                    }
                }
            },
            {
                $lookup: {
                    from: "contents",
                    foreignField: "_id",
                    localField: "contentId",
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
                    title: "$content.title",
                    genre: "$content.genre",
                    Content_Type: "$content.Content_Type",
                    release_date: "$content.release_date",
                    poster: "$content.poster",
                    createdAt: 1,
                    isOwner: 1
                }
            }

        ]
        )

        const options = {
            page: verifiedPage || 1,
            limit: 50
        }

        const WatchStatusItems = await WatchStatus.aggregatePaginate(aggregatedResult, options);

        if (verifiedPage > WatchStatusItems.totalPages && WatchStatusItems.totalDocs > 0) {
            throwGraphqlError(
                "Page not found",
                "PAGE_NOT_FOUND",
                404,
                true
            );
        }

        if (!WatchStatusItems || WatchStatusItems.totalDocs === 0) {
            throwGraphqlError(
                "No items found in the WatchStatus",
                "WatchStatus_ITEMS_NOT_FOUND",
                404,
                true
            );
        }

        return WatchStatusItems.docs;


    } catch (error) {
        return handelGraphqlError(error)
    }


}