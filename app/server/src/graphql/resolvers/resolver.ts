import type { MyContextType } from "../../types/graphql.types"

const userresolver = {
    Query: {
        Getuser: (_: any, args: {}, context:MyContextType) => {
            console.log("get user", args, context)
            return "ooo"
        }
    }
}

export { userresolver }