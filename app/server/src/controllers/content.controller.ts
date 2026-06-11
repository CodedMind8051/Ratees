
import { Content } from "../models/content.model";
import { FetchContentDataFromTmDb } from "../services/tmdb.service";
import { validate } from "../utils/validate.utils";
import { SearchContentsSchema, SearchContentDetailsSchema } from "../validators/content.validator";
import mongoose from "mongoose";
import { inngest } from "../inngest/client.inngest";
import type { SearchContentDetailsInput, SearchContentInput, ContentDetailsType } from "../types/content.types";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";


const SaveContentsDataToDB = async (ContentsToInsert: ContentDetailsType[]) => {
    try {

        if (!ContentsToInsert || ContentsToInsert.length === 0) {
            return throwGraphqlError("No content data to save", "TMDB_DATA_ERROR", 500, true)
        }

        await Content.bulkWrite(
            ContentsToInsert.map((content: ContentDetailsType) => ({
                updateOne: {
                    filter: { title: content.title },
                    update: { $setOnInsert: content },
                    upsert: true
                }
            })),
            { ordered: false }
        );
    } catch (error) {
        return handelGraphqlError(error)
    }
}

const SearchContentsController = async ({ query, page }: SearchContentInput) => {
    try {

        const { query: validatedQuery, page: validatedPage } = validate(
            SearchContentsSchema,
            {
                query,
                page
            }
        )

        const aggregateResult = Content.aggregate(
            [
                {
                    $match: {
                        title: { $regex: validatedQuery, $options: 'i' }
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        release_date: 1,
                        genre: 1,
                        poster: 1,
                        Content_Type: 1,
                        runtime: 1
                    }
                }
            ]
        )

        const options = {
            page: validatedPage || 1,
            limit: 10,
        }

        const ContentsData = await Content.aggregatePaginate(aggregateResult, options)

        if (ContentsData.totalPages < validatedPage) {
            throwGraphqlError('Page not found', 'PAGE_NOT_FOUND', 404, true)
        }

        if (!ContentsData || ContentsData.docs.length === 0) {

            const tmdbData = await FetchContentDataFromTmDb(validatedQuery)

            if (!tmdbData || tmdbData.length === 0) {

                return throwGraphqlError('No content found', 'NOT_FOUND', 404, true)

            }

            const ContentsToInsert = tmdbData?.map((content) => {

                if (!["movie", "tv"].includes(content?.Content_Type)) {
                    return null
                }

                return {
                    _id: new mongoose.Types.ObjectId(),
                    title: content?.title || content?.name,
                    description: content?.overview || "N/A",
                    poster: content?.poster_path || "N/A",
                    release_date: content?.release_date || content?.first_air_date || "N/A",
                    genre: content?.genres ? content.genres.map((genre: any) => genre.name) : [],
                    Content_Type: content?.media_type || "N/A",
                    runtime: content?.runtime || "N/A",
                    whereTOwatch: content?.["watch/providers"]?.results?.IN?.flatrate ? content?.["watch/providers"]?.results?.IN?.flatrate.map((provider: any) => ({
                        platform: provider.provider_name,
                        logo: provider.logo_path || "N/A"
                    })) : [],
                    casts: content?.credits?.cast ? content.credits.cast.slice(0, 4).map((cast: any) => ({
                        name: cast.name,
                        character: cast.character,
                        profile_path: cast.profile_path || "N/A"
                    })) : [],

                    director: content?.credits?.crew ? content.credits.crew.filter((crew: any) => crew.job === "Director").slice(0, 2).map(
                        (director: any) => ({
                            name: director.name,
                            profile_path: director.profile_path
                        })
                    ) : [],
                    ...(content?.media_type === "tv" && {
                        total_episodes: content?.number_of_episodes
                    }),
                    ...(content?.media_type === "tv" && {
                        total_seasons: content?.number_of_seasons
                    })
                }
            }).filter((content: any) => content !== null)

            if (!ContentsToInsert || ContentsToInsert.length === 0) {
                return throwGraphqlError('No content found', 'NOT_FOUND', 404, true)
            }

            await inngest.send({
                name: "Contents/data.save",
                data: {
                    ContentsToInsert
                }
            })

            return ContentsToInsert?.map(content => ({
                _id: content?._id,
                title: content?.title,
                description: content?.description,
                release_date: content?.release_date,
                genre: content?.genre,
                poster: content?.poster,
                Content_Type: content?.Content_Type,
                runtime: content?.runtime,
            }))
        }

        return ContentsData?.docs

    }
    catch (error) {
        handelGraphqlError(error)
    }
}

const FetchContentDetailsController = async ({ ContentId }: SearchContentDetailsInput): Promise<ContentDetailsType> => {

    try {
        const { ContentId: verifiedId } = validate(SearchContentDetailsSchema, { ContentId })

        const contentDetails = await Content.aggregate([

            {
                $match: {
                    _id: new mongoose.Types.ObjectId(verifiedId)
                }
            },
            {
                $project: {
                    total_number_of_ratings: 0
                }
            }
        ])

        if (!contentDetails || contentDetails.length === 0) {
            throwGraphqlError("Content Details not found", "NOT_FOUND", 404, true)
        }

        return contentDetails[0]

    } catch (error) {
        return handelGraphqlError(error)
    }

}





export { SearchContentsController, SaveContentsDataToDB, FetchContentDetailsController }