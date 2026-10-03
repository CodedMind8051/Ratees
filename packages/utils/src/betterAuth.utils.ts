import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { DbName } from "@ratees/constants";
import { UserAdditionalField } from "@ratees/db/src/models/user.model";
import { bearer } from "better-auth/plugins";

const UserSessionExpiresIn = 60 * 60 * 24 * 10
const UserSessionUpdateIn = 60 * 60 * 24 * 3


if (!process.env.MongoDb_Url) {
    throw new Error("MongoDb_Url is not defined in environment variables")
   
}

if (!process.env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL is not defined in environment variables")

}

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not defined in environment variables")

}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables")
}

const mongoClient = new MongoClient(`${process.env.MongoDb_Url}/${DbName}`);
const db = mongoClient.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: mongoClient
    }
    ),
    plugins:[bearer()],
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.CORS_ORIGIN!],
    user: {
        modelName: "users",
        additionalFields: UserAdditionalField,
        fields: {
            image: "profileImage",
            name: "username"
        }
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    session: {
        expiresIn: UserSessionExpiresIn,
        updateAge: UserSessionUpdateIn
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true
        },
        useSecureCookies: process.env.NODE_ENV === "production"
    }
}
)

