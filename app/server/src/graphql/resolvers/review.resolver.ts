import type { MyContextType } from "../../types/graphql.types"
import { isAuthenticated } from "../../middlewares/auth.middleware"
import type { SubmitReviewType, deleteReviewType, getReviewsInputType } from "../../types/review.types"
import { deleteReviewController, submitReviewController, getReviewsController } from "../../controllers/review.controller"


const reviewResolver = {
    Query: {
        getReviews: async (
            _: any,
            {
                ContentId,
                page
            }: getReviewsInputType,
            context: MyContextType
        ) => {
            const result = await getReviewsController({ ContentId, page })
            return result
        }
    },

    Mutation: {
        submitReview: async (
            _: any,
            {
                ContentId,
                review,
            }: SubmitReviewType,
            context: MyContextType
        ) => {
            isAuthenticated(context)
            const userId = (context.req.session as any).session.userId
            const result = await submitReviewController({ userId, ContentId, review })
            return result
        },

        deleteReview: async (
            _: any,
            {
                reviewId
            }: deleteReviewType,
            context: MyContextType
        ) => {
            isAuthenticated(context)
            const userId = (context.req.session as any).session.userId
            const result = await deleteReviewController({ reviewId, userId })
            return result
        }



    }
}

export { reviewResolver }