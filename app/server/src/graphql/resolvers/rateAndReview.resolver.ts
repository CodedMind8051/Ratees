import type { MyContextType } from "../../types/graphql.types"
import { isAuthenticated } from "../../middlewares/auth.middleware"
import type { SubmitRatingInput } from "../../types/ratingAndReview.types"
import { SubmitRatingController } from "../../controllers/rateAndReview.controller"

const RateAndReviewResolver = {
    Mutation: {
        submitRating: async (
            _: any,
            {
                ContentId,
                rating,
            }: SubmitRatingInput,
            context: MyContextType
        ) => {
            isAuthenticated(context)
            const userId = (context.req.session as any).session.userId
            const result = await SubmitRatingController({ userId, ContentId, rating })
            return result
        }

    }
}

export { RateAndReviewResolver }