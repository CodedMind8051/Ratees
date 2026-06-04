import { z } from "zod"
import { SearchContentsSchema, MongooseIdSchema } from "../validators/content.validator"

export type SearchContentInput = z.infer<typeof SearchContentsSchema>
export type MongooseIdInput = z.infer<typeof MongooseIdSchema>

type WatchPlatform = {
    platform: string;
    logo: string;
};

type Cast = {
    name: string;
    character: string;
    profile_path: string;
};

type Director = {
    name: string;
    profile_path: string;
};

export type ContentDetailsType = {
    _id: MongooseIdInput;
    title: string;
    description: string;
    release_date: string;
    genre: string[];
    poster: string;
    Content_Type: string;
    runtime?: string;

    whereTOwatch?: WatchPlatform[];
    casts?: Cast[];
    director?: Director[];

    total_seasons?: number;
    total_episodes?: number;
};

