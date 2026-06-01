import { GraphQLError } from "graphql";
import { Content } from "../models/content.model";
import { FetchContentDataFromTmDb } from "../services/tmdb.service";
import { validate } from "../utils/validate.utils";
import { SearchContentsSchema } from "../validators/content.validator";
import mongoose from "mongoose";
import { inngest } from "../inngest/client.inngest";


const SaveContentsDataToDB = async (ContentsToInsert: any) => {
    try {

        if (!ContentsToInsert || ContentsToInsert.length === 0) {
            throw new GraphQLError("No content data to save", {
                extensions: {
                    code: "TMDB_DATA_ERROR",
                    http: { status: 500 }
                }
            })
        }

        await Content.bulkWrite(
            ContentsToInsert.map((content: any) => ({
                updateOne: {
                    filter: { _id: content.title },
                    update: { $setOnInsert: content },
                    upsert: true
                }
            })),
            { ordered: false }
        );

    } catch (error) {
        throw new Error(
            `Failed to save content data to DB: ${error instanceof Error ? error.message : String(error)
            }`
        );
    }
}

const SearchMoviesController = async (query: string, page?: number) => {
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

        if (ContentsData.totalPages<validatedPage) {
            throw new GraphQLError('Page not found', {
                extensions: {
                    code: 'Page_NOT_FOUND',
                    http: { status: 404 }
                }
            })
        }

        if (!ContentsData || ContentsData.docs.length === 0) {

            const tmdbData = await FetchContentDataFromTmDb(validatedQuery)

            if (!tmdbData || tmdbData.length === 0) {

                throw new GraphQLError('No content found', {
                    extensions: {
                        code: 'NOT_FOUND',
                        http: { status: 404 }
                    }
                })
            }

            const ContentsToInsert = tmdbData.map((content: any) => {

                if (!["movie", "tv"].includes(content?.media_type)) {
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


            await inngest.send({
                name: "Contents/data.save",
                data: {
                    ContentsToInsert
                }
            })

            return ContentsToInsert.map(content => ({
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

        if (error instanceof GraphQLError) {
            throw error
        }

        throw new GraphQLError("something went wrong please try again..", {
            extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 }
            }
        })
    }
}

export { SearchMoviesController, SaveContentsDataToDB }