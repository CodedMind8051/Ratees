import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = (fieldName: string) => {
    return z.string().refine(
        Types.ObjectId.isValid, {
        message: `Invalid ${fieldName}`
    }
    )
}

