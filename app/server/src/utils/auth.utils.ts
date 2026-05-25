import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { DbName } from "../constants";
import { UserAdditionalField } from "../models/user.model";
import { UserSessionExpiresIn, UserSessionUpdateIn } from "../constants"



const mongoClient = new MongoClient(`${process.env.MongoDb_Url}/${DbName}`);
const db = mongoClient.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: mongoClient
    }
    ),
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
    }
}
)

