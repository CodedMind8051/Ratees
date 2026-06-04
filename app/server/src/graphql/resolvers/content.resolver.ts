import type { MyContextType } from "../../types/graphql.types"
import { SearchContentsController, FetchContentDetailsController } from "../../controllers/content.controller"
import type { MongooseIdInput, SearchContentInput } from "../../types/content.types";


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
            { _id }: MongooseIdInput,
            context: MyContextType) => {

            const contentDetails = await FetchContentDetailsController({ _id })

            return contentDetails

        }

    }
}

export { contentResolver }