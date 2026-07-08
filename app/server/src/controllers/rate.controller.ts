import { Rate, RatingState } from "../models/rating.model";
import type { SubmitRatingInput } from "../types/rating.types";
import { validate } from "../utils/validate.utils";
import { RateSchema } from "../validators/rating.validator";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";
import mongoose from "mongoose";

const SubmitRatingController = async ({ userId, ContentId, rating }: SubmitRatingInput): Promise<boolean> => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { userId: verifiedUserId, ContentId: verifiedContentId, rating: verifiedRating } = validate(RateSchema, { userId, ContentId, rating })

        const ratingOptions = ["wasteOfTime", "TimePassRating", "GoodWatchRating", "MasterPieceRating"] as const
        const existingUserRating = await Rate.findOne(
            {
                userId: new mongoose.Types.ObjectId(verifiedUserId),
                ContentId: new mongoose.Types.ObjectId(verifiedContentId)
            },
            {},
            {
                session
            }

        )

        if (existingUserRating && existingUserRating.rating === verifiedRating) {
            await session.commitTransaction()
            return true
        }

        const contentRatings = await RatingState.findOneAndUpdate(
            {
                ContentId: new mongoose.Types.ObjectId(verifiedContentId)
            },
            {
                $setOnInsert: {
                    ContentId: new mongoose.Types.ObjectId(verifiedContentId)
                }
            },
            {
                upsert: true,
                session,
                returnDocument: "after"
            }

        )


        if (!contentRatings) {
            throwGraphqlError("Failed to find or create rating state for the content", "RATING_STATE_ERROR", 500, true)
        }

        if (existingUserRating) {

            contentRatings[ratingOptions[verifiedRating - 1]!].totalCount += 1
            contentRatings[ratingOptions[existingUserRating.rating - 1]!].totalCount -= 1
            existingUserRating.rating = verifiedRating

            const result1 = await contentRatings.save({ session, validateBeforeSave: false })
            const result2 = await existingUserRating.save({ session, validateBeforeSave: false })

            if (!result1 || !result2) {
                throwGraphqlError("Failed to update rating", "RATING_UPDATE_ERROR", 500, true)
            }

            await session.commitTransaction()

            return true
        }

        const UserRating = await Rate.create(
            [{
                userId: new mongoose.Types.ObjectId(verifiedUserId),
                ContentId: new mongoose.Types.ObjectId(verifiedContentId),
                rating: verifiedRating
            }],
            { session })


        contentRatings[ratingOptions[verifiedRating - 1]!].totalCount += 1
        contentRatings.totalNumberOfRatings += 1

        const result = await contentRatings.save({ session, validateBeforeSave: false })

        if (!result || !UserRating) {
            throwGraphqlError("Failed to submit rating", "RATING_SUBMISSION_ERROR", 500, true)
        }

        await session.commitTransaction()
        return true

    } catch (error) {

        if (session.inTransaction()) await session.abortTransaction()

        return handelGraphqlError(error)

    } finally {
        await session.endSession()
    }
}

// const FetchRatingOfUserController = async ({ userId, ContentId }:any) => {

// }

export { SubmitRatingController }