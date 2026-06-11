import type { MyContextType } from "../../types/graphql.types"
import { isAuthenticated } from "../../middlewares/auth.middleware"
import type { SubmitRatingInput } from "../../types/rating.types"
import { SubmitRatingController } from "../../controllers/rate.controller"

const rateResolver = {
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

export { rateResolver }