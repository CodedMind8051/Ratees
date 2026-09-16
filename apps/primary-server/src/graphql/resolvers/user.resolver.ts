import { isAuthenticated } from "../../middlewares/auth.middleware"
import type { MyContextType } from "../../types/graphql.types"
import { GetUserController, UpdateUsernameController, UpdatePasswordController } from "../../controllers/user.controller"
import type { UpdateUsernameInputType, UpdatePasswordInputType } from "../../types/user.types"

const userResolver = {
    Query: {
        getUser: async (
            _: any,
            __: any,
            context: MyContextType
        ) => {
            isAuthenticated(context)
            const userId = (context.req.session as any)?.session?.userId
            const result = await GetUserController(userId)
            return result
        }
    },
    Mutation: {
        updateUsername: async (
            _: any,
            { username }: UpdateUsernameInputType,
            context: MyContextType
        ) => {
            isAuthenticated(context)
            const userId = (context.req.session as any)?.session?.userId
            const result = await UpdateUsernameController({ userId, username, headers: context.req.headers })
            return result
        },
        updatePassword: async (
            _: any,
            { currentPassword, newPassword }: UpdatePasswordInputType,
            context: MyContextType
        ) => {
            isAuthenticated(context)
            const result = await UpdatePasswordController({  currentPassword, newPassword, headers: context.req.headers })
            return result
        }
    }
}

export { userResolver }
