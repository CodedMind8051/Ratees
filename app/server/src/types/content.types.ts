import { z } from "zod"
import { SearchContentsSchema, SearchContentDetailsSchema } from "../validators/validator"

export type SearchContentInput = z.infer<typeof SearchContentsSchema>
export type SearchContentDetailsInput = z.infer<typeof SearchContentDetailsSchema>

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
    _id: SearchContentDetailsInput;
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

