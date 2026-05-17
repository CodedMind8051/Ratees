import type { Request, Response } from "express";

export type MyContextType = {
    req: Request,
    res: Response
}


