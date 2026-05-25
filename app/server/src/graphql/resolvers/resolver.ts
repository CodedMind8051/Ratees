import type { MyContextType } from "../../types/graphql.types"
import { isAuthenticated } from "../../middlewares/auth.middleware"

const userresolver = {
    Query: {
        Getuser: (_: any, args: {}, context: MyContextType) => {
            isAuthenticated(context)
            return "ooo"
        }
    }
}

export { userresolver }