import { z } from "zod"
import { UpdateUsernameSchema, UpdatePasswordSchema } from "../validators/user.validator"

export type UpdateUsernameInputType = z.infer<typeof UpdateUsernameSchema>
export type UpdatePasswordInputType = z.infer<typeof UpdatePasswordSchema>
