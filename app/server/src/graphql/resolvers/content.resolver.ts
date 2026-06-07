import type { MyContextType } from "../../types/graphql.types"
import { SearchContentsController, FetchContentDetailsController } from "../../controllers/content.controller"
import type { SearchContentDetailsInput, SearchContentInput } from "../../types/content.types";


const contentResolver = {
    Query: {
        getContentsList: async (
            _: any, { query, page }: SearchContentInput,
            context: MyContextType) => {

            const contents = await SearchContentsController({ query, page })

            return contents
        },

        getContentDetails: async (
            _: any,
            { ContentId }: SearchContentDetailsInput,
            context: MyContextType) => {

            const contentDetails = await FetchContentDetailsController({ ContentId: ContentId ?? "" })

            return contentDetails

        }

    }
}

export { contentResolver }