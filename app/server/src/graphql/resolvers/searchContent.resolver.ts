import type { MyContextType } from "../../types/graphql.types"
import { inngest } from "../../inngest/client.inngest"


const contentResolver = {
    Query: {
        getContentsList: async (_: any, args: { query: string, page: number }, context: MyContextType) => {
            const contentList = await inngest.send({
                name: "Contents/info.fetch",
                data: {
                    query: args?.query,
                    page: args?.page
                },
            })
            return "contentList[0]"
        }

    }
}

export { contentResolver }