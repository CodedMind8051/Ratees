import { User } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { fromNodeHeaders } from "better-auth/node";
import { handelGraphqlError } from "../utils/handelError.utils";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { validate } from "../utils/validate.utils"
import { GetUserSchema, UpdateUsernameSchema, UpdatePasswordSchema } from "../validators/user.validator"
import type { UpdateUsernameInputType, UpdatePasswordInputType } from "../types/user.types"
import mongoose from "mongoose";

export const GetUserController = async (userId: string) => {
    try {

        const { userId: verifiedUserId } = validate(GetUserSchema, { userId })

        const user = await User.findById(new mongoose.Types.ObjectId(verifiedUserId))
            .select("username email profileImage")

        if (!user) {
            throwGraphqlError("User not found", "NOT_FOUND", 404, true)
        }

        return user

    } catch (error) {
        return handelGraphqlError(error)
    }
}

export const UpdateUsernameController = async ({
    userId,
    username,
    headers
}: UpdateUsernameInputType & { headers: Record<string, string | string[] | undefined> }) => {
    try {

        const { username: verifiedUsername, userId: verifiedUserId } = validate(UpdateUsernameSchema, { username, userId })

        const existedUser = await User.exists({
            username: verifiedUsername,
            _id: { $ne: new mongoose.Types.ObjectId(verifiedUserId) }
        }
        )

        if (existedUser) {
            throwGraphqlError("Username already exists", "USERNAME_EXISTS", 400, true)
        }


        await auth.api.updateUser({
            body: { name: verifiedUsername },
            headers: fromNodeHeaders(headers)
        })

        const updatedUser = await User.findById(new mongoose.Types.ObjectId(verifiedUserId))
            .select("username email profileImage")

        if (!updatedUser) {
            throwGraphqlError("User not found", "NOT_FOUND", 404, true)
        }

        return updatedUser

    } catch (error) {
        return handelGraphqlError(error)
    }
}

export const UpdatePasswordController = async ({
    currentPassword,
    newPassword,
    headers
}: UpdatePasswordInputType & { headers: Record<string, string | string[] | undefined> }) => {
    try {

        const { currentPassword: verifiedCurrentPassword, newPassword: verifiedNewPassword } = validate(UpdatePasswordSchema, {
            currentPassword,
            newPassword
        })

        await auth.api.changePassword({
            body: {
                currentPassword: verifiedCurrentPassword,
                newPassword: verifiedNewPassword
            },
            headers: fromNodeHeaders(headers)
        })

        return true

    } catch (error) {
        return handelGraphqlError(error)
    }
}
