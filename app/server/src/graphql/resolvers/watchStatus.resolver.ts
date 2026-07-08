import type { MyContextType } from "../../types/graphql.types"
import type { WatchStatusIdentifierInputType, getContentListInWatchStatusInputType, submitWatchStatusOfContentInputType } from "../../types/watchStatus.types"
import { isAuthenticated } from "../../middlewares/auth.middleware"
import { getWatchStatusOfContent, getContentListInWatchStatus, submitWatchStatusOfContent, updateWatchStatusOfContent, deleteWatchStatusOfContent } from "../../controllers/watchStatus.controller"

export const watchStatusResolver = {
    Query: {
        getWatchStatusOfContent: async (
            _: any,
            {
                contentId
            }: WatchStatusIdentifierInputType,
            context: MyContextType
        ) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId

            const result = await getWatchStatusOfContent({ contentId, userId })

            return result
        },
        getContentListInWatchStatus: async (
            _: any,
            {
                userId,
                watchStatus,
                page
            }: getContentListInWatchStatusInputType,
            context: MyContextType
        ) => {

            const RequestUserId = (context?.req?.session as any)?.session?.userId
            const result = await getContentListInWatchStatus({ userId, RequestUserId, watchStatus, page })
            return result

        }
    },
    Mutation: {
        submitWatchStatusOfContent: async (
            _: any,
            {
                contentId,
                watchStatus
            }: submitWatchStatusOfContentInputType,
            context: MyContextType
        ) => {

            isAuthenticated(context)

            const userId = (context?.req?.session as any)?.session?.userId

            const result = await submitWatchStatusOfContent({ userId, contentId, watchStatus })

            return result
        },
        updateWatchStatusOfContent: async (
            _: any,
            {
                contentId,
                watchStatus
            }: submitWatchStatusOfContentInputType,
            context: MyContextType
        ) => {
            isAuthenticated(context)

            const userId = (context?.req?.session as any)?.session?.userId

            const result = await updateWatchStatusOfContent({ userId, contentId, watchStatus })

            return result
        },
        deleteWatchStatusOfContent: async (
            _: any,
            {
                contentId
            }: WatchStatusIdentifierInputType,
            context: MyContextType
        ) => {

            isAuthenticated(context)

            const userId = (context?.req?.session as any)?.session?.userId

            const result = await deleteWatchStatusOfContent({ userId, contentId })

            return result
        }
    }
}