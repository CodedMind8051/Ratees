import { auth } from "../utils/auth.utils";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/AsyncHandler.utils";
import { GraphQLError } from "graphql";
import type { MyContextType } from "../types/graphql.types";


const sessionMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    })
    req.session = session
    next()

});

const isAuthenticated = (context: MyContextType) => {
    if (!context.req.session) {
        throw new GraphQLError("Unauthorized", {
            extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 }
            }
        });
    }
}


export { sessionMiddleware, isAuthenticated }