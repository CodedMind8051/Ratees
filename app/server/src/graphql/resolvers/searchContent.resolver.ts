import type { MyContextType } from "../../types/graphql.types"
import { SearchMoviesController } from "../../controllers/searchMovies.controller"


const contentResolver = {
    Query: {
        getContentsList: async (_: any, args: { query: string, page: number }, context: MyContextType) => {

            const contents = await SearchMoviesController(args?.query, args?.page)

            return contents
        }

    }
}

export { contentResolver }