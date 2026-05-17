import type { Request, Response, NextFunction } from "express"

type asyncHandler = (

    req: Request,
    res: Response,
    next: NextFunction

) => Promise<any>

const asyncHandler = (requestHandler: asyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }

