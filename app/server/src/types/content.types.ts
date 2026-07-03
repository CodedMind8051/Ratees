import { z } from "zod"
import { SearchContentsSchema, ContentDetailsInputSchema, FetchContentsForHomepageSchema } from "../validators/content.validator"
import { pageSchema } from "../validators/common.validator"
import mongoose from "mongoose"

export type SearchContentInput = z.infer<typeof SearchContentsSchema>
export type ContentDetailsInput = z.infer<typeof ContentDetailsInputSchema>
export type FetchContentsForHomepageInput = z.infer<typeof FetchContentsForHomepageSchema>
export type PageNumberType = z.infer<typeof pageSchema>

type WatchPlatform = {
    platform: string;
    logo: string;
};

type Cast = {
    name: string;
    character: string;
    profile_path: string;
};


export type ContentDetailsType = {
    _id: mongoose.Types.ObjectId,
    title: string;
    description: string;
    release_date: string;
    genre: string[];
    poster: string;
    backdrop: string;
    Content_Type: "movie" | "tv" | "N/A";
    runtime?: number;
    whereTOwatch?: WatchPlatform[];
    casts?: Cast[];
    director?: string
    userRating?: number
    total_seasons?: number;
    total_episodes?: number;
    masterpiecePercentage?: number
    TimePassPercentage?: number
    GoodWatchPercentage?: number
    wasteOfTimePercentage?: number
    totalNumberOfRating?: number
};



