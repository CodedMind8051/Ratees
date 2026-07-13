import express from "express";
import cors from "cors";
import { expressMiddleware } from '@as-integrations/express5';
import { CreateApolloServer } from "./graphql/index";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.utils";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.inngest"
import type { Request, Response, NextFunction } from "express";
import { sessionMiddleware } from "./middlewares/auth.middleware"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(express.static("public"));


app.use((req, res, next) => {

  if (req.path.startsWith("/api/inngest")) {

    return next();
  }

  sessionMiddleware(req, res, next);
});

app.all('/api/auth/*any', toNodeHandler(auth));


app.use("/api/inngest", serve({
    client: inngest,
    functions
}));


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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err.message)

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })

})

export { app, startGraphqlServer }
