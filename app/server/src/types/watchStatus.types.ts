import { WatchStatusIdentifierInputSchema, submitWatchStatusOfContentInputSchema, getContentListInWatchStatusInputSchema } from "../validators/watchStatus.validator";
import { z } from "zod"

export type WatchStatusIdentifierInputType = z.infer<typeof WatchStatusIdentifierInputSchema>
export type submitWatchStatusOfContentInputType = z.infer<typeof submitWatchStatusOfContentInputSchema>
export type getContentListInWatchStatusInputType = z.infer<typeof getContentListInWatchStatusInputSchema>

export enum WatchStatusEnum {
    Watching = "Watching",
    WATCHED = "Watched",
    WATCH_LATER = "Watch Later",
}

export type getContentListInWatchStatusResponseType = {
    title: "string",
    genre: "string",
    Content_Type: "string",
    release_date: "string",
    poster: "string",
    createdAt: Date
}