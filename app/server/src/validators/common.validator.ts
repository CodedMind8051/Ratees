import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = (fieldName: string) => {
    return z.string().refine(
        Types.ObjectId.isValid, {
        message: `Invalid ${fieldName}`
    }
    )
}

export const pageSchema = z
    .number({
        error: "Page number is required"
    })
    .int("Page number must be an integer")
    .positive("Page number must be greater than 0")


