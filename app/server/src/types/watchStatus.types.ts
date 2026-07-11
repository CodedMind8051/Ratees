import { WatchStatusIdentifierInputSchema, submitWatchStatusOfContentInputSchema, getContentListInWatchStatusInputSchema } from "../validators/watchStatus.validator";
import { z } from "zod"

export type WatchStatusIdentifierInputType = z.infer<typeof WatchStatusIdentifierInputSchema>
export type submitWatchStatusOfContentInputType = z.infer<typeof submitWatchStatusOfContentInputSchema>
export type getContentListInWatchStatusInputType = z.infer<typeof getContentListInWatchStatusInputSchema>


export type getContentListInWatchStatusResponseType = {
    title: "string",
    contentId: "string",
    genre: "string",
    Content_Type: "string",
    release_date: "string",
    poster: "string",
    createdAt: Date
}

