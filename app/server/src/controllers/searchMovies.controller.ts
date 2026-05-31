import { GraphQLError } from "graphql";
import { Content } from "../models/content.model";
import { FetchContentDataFromTmDb } from "../services/tmdb.service";

const SearchMoviesController = async (query: string, page?: number) => {
    try {

        if (!query || query.trim() === '') {
            throw new GraphQLError('Name is required');
        }

        if (page !== undefined && (isNaN(page) || page < 1)) {
            throw new GraphQLError('Invalid page number');
        }

        const aggregateResult = Content.aggregate(
            [
                {
                    $match: {
                        title: { $regex: query, $options: 'i' }
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
            page: page || 1,
            limit: 10,
        }

        const ContentsData = await Content.aggregatePaginate(aggregateResult, options)

        if (!ContentsData || ContentsData.docs.length === 0) {

            const tmdbData = await FetchContentDataFromTmDb(query)

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

            const insertedContents = await Content.insertMany(ContentsToInsert)


            return insertedContents.map(content => ({
                _id: content._id,
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
        console.log("Error in SearchMoviesController:", error)
        throw new GraphQLError("something went wrong please try again..", {
            extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 }
            }
        })
    }
}

export { SearchMoviesController };