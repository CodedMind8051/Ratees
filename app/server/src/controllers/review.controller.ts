import type { SubmitReviewType, deleteReviewType, updateReviewType, getReviewsInputType, ReviewsDetailsDataType } from "../types/review.types"
import { validate } from "../utils/validate.utils"
import { SubmitReviewSchema, deleteReviewSchema, updateReviewSchema, getReviewsSchema } from "../validators/review.validator"
import { throwGraphqlError } from "../utils/throwGraphqlError.utils"
import { handelGraphqlError } from "../utils/handelError.utils"
import { Review } from "../models/review.model"
import mongoose from "mongoose"
import { Content } from "../models/content.model"
import { User } from "../models/user.model"
import { err } from "inngest/types"


const submitReviewController = async ({ userId, ContentId, review }: SubmitReviewType): Promise<boolean> => {
    const session = await mongoose.startSession()
    try {

        const {
            userId: verifiedUserId,
            ContentId: verifiedContentId,
            review: verifiedReview } = validate(
                SubmitReviewSchema,
                {
                    userId,
                    ContentId,
                    review
                }
            )


        const isContentExists = await Content.exists({
            _id: new mongoose.Types.ObjectId(verifiedContentId)
        })
        const isUserExists = await User.exists({
            _id: new mongoose.Types.ObjectId(verifiedUserId)
        })

        if (!isContentExists || !isUserExists) {
            const message = !isContentExists ? "Content not exists" : !isUserExists ? "User not exists" : "Not Found"
            throwGraphqlError(message, "NOT_FOUND", 404, true)
        }

        const existingUserReviewCount = await Review.countDocuments(
            {
                userId: new mongoose.Types.ObjectId(verifiedUserId),
                ContentId: new mongoose.Types.ObjectId(verifiedContentId),
            },
            {
                session
            }

        )

        if (existingUserReviewCount >= 5) {
            throwGraphqlError("You can only submit 5 reviews for a content", "REVIEW_LIMIT_EXCEEDED", 400, true)
        }

        const ReviewSaved = await Review.create([{
            userId: new mongoose.Types.ObjectId(verifiedUserId),
            ContentId: new mongoose.Types.ObjectId(verifiedContentId),
            review: verifiedReview
        }], { session })


        if (!ReviewSaved || ReviewSaved.length === 0) {
            throwGraphqlError("Failed to submit review", "REVIEW_SUBMISSION_FAILED", 500, true)
        }

        return true

    } catch (error) {
        return handelGraphqlError(error)
    } finally {
        await session.endSession()
    }
}

const getReviewsController = async ({
    ContentId,
    page
}: getReviewsInputType): Promise<ReviewsDetailsDataType> => {

    try {
        const { ContentId: verifiedContentId, page: validatedPage } = validate(getReviewsSchema, { ContentId, page })

        const isContentExists = await Content.exists({
            _id: new mongoose.Types.ObjectId(verifiedContentId)
        })

        if (!isContentExists) {
            throwGraphqlError("Content not found", "NOT_FOUND", 404, true)
        }

        const aggregateResult = Review.aggregate([
            {
                $match: {
                    ContentId: new mongoose.Types.ObjectId(verifiedContentId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetail"
                }
            },
            {
                $addFields: {
                    isOwn: {
                        $eq: ["6a3baa03034506e31bc39fab", "6a3baa03034506e31bc39fab"]
                    }
                }
            },
            {
                $unwind: {
                    path: "$userDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    review: 1,
                    createdAt: 1,
                    userId: "$userDetail._id",
                    username: "$userDetail.username",
                    userEmail: "$userDetail.email",
                    profileImage: "$userDetail.profileImage",
                    isOwn: "$isOwn"
                }
            }
        ])


        const options = {
            page: validatedPage || 1,
            limit: 20,
        }

        const ReviewsDetailsData = await Review.aggregatePaginate(aggregateResult, options)


        if (ReviewsDetailsData.totalPages < validatedPage) {
            throwGraphqlError('Page not found', 'PAGE_NOT_FOUND', 404, true)
        }

        if (!ReviewsDetailsData || ReviewsDetailsData.totalDocs === 0) {
            throwGraphqlError("No review found", "REVIEW_NOT_FOUND", 404, true)
        }

        console.log(ReviewsDetailsData.docs[0])
        return ReviewsDetailsData.docs
    } catch (error) {
        console.log(error)
        return handelGraphqlError(error)
    }

}

const updateReviewController = async ({ reviewId, userId, review }: updateReviewType): Promise<boolean> => {
    try {

        const {
            reviewId: verifiedReviewId,
            userId: verifiedUserId,
            review: verifiedReview } = validate(
                updateReviewSchema,
                {
                    reviewId,
                    userId,
                    review
                }
            )


        const isReviewExisted = await Review.exists({
            _id: new mongoose.Types.ObjectId(verifiedReviewId)
        })

        if (!isReviewExisted) {
            throwGraphqlError("Review not exists..", "NOT_FOUND", 404, true)
        }

        const reviewUpdated = await Review.updateOne({
            _id: new mongoose.Types.ObjectId(verifiedReviewId),
            userId: new mongoose.Types.ObjectId(verifiedUserId)
        }, {
            $set: {
                review: verifiedReview
            }
        })


        if (!reviewUpdated || reviewUpdated.matchedCount === 0) {
            throwGraphqlError("Failed to update review", "REVIEW_UPDATE_FAILED", 500, true)
        }

        return true


    } catch (error) {
        return handelGraphqlError(error)
    }
}

const deleteReviewController = async ({ reviewId, userId }: deleteReviewType): Promise<boolean> => {

    try {
        const { reviewId: verifiedReviewId, userId: verifiedUserId } = validate(deleteReviewSchema, { reviewId, userId })

        const isReviewExisted = await Review.exists({
            _id: new mongoose.Types.ObjectId(verifiedReviewId),
            userId: new mongoose.Types.ObjectId(verifiedUserId)
        })

        if (!isReviewExisted) {
            throwGraphqlError("Review not exists..", "NOT_FOUND", 404, true)
        }

        const reviewDeleted = await Review.deleteOne({
            _id: new mongoose.Types.ObjectId(verifiedReviewId),
            userId: new mongoose.Types.ObjectId(verifiedUserId)
        })

        if (!reviewDeleted || reviewDeleted.deletedCount === 0) {
            throwGraphqlError("Failed to delete review.", "REVIEW_DELETE_FAILED", 500, true)
        }

        return true

    } catch (error) {
        return handelGraphqlError(error)
    }
}




export { submitReviewController, deleteReviewController, updateReviewController, getReviewsController }