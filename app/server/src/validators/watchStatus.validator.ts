import { z } from "zod";
import { objectIdSchema, pageSchema } from "./common.validator";



export enum WatchStatusEnum {
    Watching = "Watching",
    WATCHED = "Watched",
    WATCH_LATER = "Watch Later",
}

export const WatchStatusIdentifierInputSchema = z.object({
    userId: objectIdSchema("UserId"),
    contentId: objectIdSchema("ContentId"),
});

export const submitWatchStatusOfContentInputSchema = WatchStatusIdentifierInputSchema.extend({
    watchStatus: z.enum(WatchStatusEnum)
})

export const getContentListInWatchStatusInputSchema = z.object({
    userId: objectIdSchema("userId"),
    RequestUserId: objectIdSchema("RequestUserId"),
    watchStatus: z.enum(WatchStatusEnum),
    page: pageSchema
})