import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { expressMiddleware } from '@as-integrations/express5';
import { CreateApolloServer } from "./graphql/index";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(express.static("public"));

const startGraphqlServer = async () => {
    try {
        const server = await CreateApolloServer()
        app.use(
            '/graphql',
            expressMiddleware(server, {
                context: async ({ req, res }) => {
                    return { req, res }
                }
            }),
        );
    } catch (error) {
        console.log("❌ Failed to start Apollo server", error)
    }
}


export { app, startGraphqlServer }