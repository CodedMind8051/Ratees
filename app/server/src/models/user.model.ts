import z from "zod"
import mongoose, { Schema } from "mongoose"

export const UserAdditionalField = {
    
    genre: {
        type: "string[]",
        validator: {
            input: z.array(z.string()).max(3, "Only 3 genres at a time is allowed")
        },
        defaultValue: [] as string[]
    },

    searchHistory: {
        type: "string[]",
        validator: {
            input: z.array(z.string()).max(10, "Only 10 searchHistory at a time is allowed")
        },
        defaultValue: [] as string[]
    },
} as const


const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        emailVerified: {
            type: Boolean,
            default: false
        }
        ,

        image: {
            type: String,
            required: true
        },

        genre: {
            type: [String],
            validate: (val: String[]) => z.array(z.string()).max(3, "Only 3 genres at a time is allowed").parse(val),
            default: []
        },

        searchHistory: {
            type: [String],
            validate: (val: String[]) => z.array(z.string()).max(10, "Only 10 searchHistory at a time is allowed").parse(val),
            default: []
        },
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("Users", UserSchema)