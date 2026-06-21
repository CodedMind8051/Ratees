import { SearchContentsController, FetchContentDetailsController, FetchGeneralContentsForHomepage, FetchTrendingContents, fetchNewReleaseContents } from "../../controllers/content.controller"
import type { SearchContentDetailsInput, SearchContentInput, PageNumberType } from "../../types/content.types";

const contentResolver = {
    Query: {
        getContentsList: async (
            _: any, { query, page }: SearchContentInput) => {

            const contents = await SearchContentsController({ query, page })

            return contents
        },

        getContentDetails: async (
            _: any,
            { ContentId }: SearchContentDetailsInput) => {


            const contentDetails = await FetchContentDetailsController({ ContentId: ContentId  })

            return contentDetails

        },

        FetchGeneralContentsForHomepage: async (
            _: any, { page }: { page: number }) => {

            const HomeContents = await FetchGeneralContentsForHomepage(page)

            return HomeContents

        },

        FetchTrendingContents: async (
        ) => {
            const TrendingContent = await FetchTrendingContents()
            return TrendingContent
        },

        FetchNewReleaseContents: async (
        ) => {
            const NewReleaseContent = await fetchNewReleaseContents()

            return NewReleaseContent
        }

    }
}

export { contentResolver }