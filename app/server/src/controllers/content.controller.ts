import { Content, TrendingContent } from "../models/content.model";
import { FetchContentDataFromTmDb } from "../services/tmdb.service";
import { validate } from "../utils/validate.utils";
import { SearchContentsSchema, ContentDetailsInputSchema, pageSchema } from "../validators/content.validator";
import mongoose from "mongoose";
import type { ContentDetailsInput, SearchContentInput, ContentDetailsType, PageNumberType } from "../types/content.types";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";
import { TmdbContentToContentDocument } from "../utils/content.utils"



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
                        runtime: 1,
                        backdrop: 1
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

                return TmdbContentToContentDocument(content)
            }).filter((content: any): content is ContentDetailsType => content !== null)


            if (!ContentsToInsert || ContentsToInsert.length === 0) {
                return throwGraphqlError('No content found', 'NOT_FOUND', 404, true)
            }

            SaveContentsDataToDB(ContentsToInsert)

            return ContentsToInsert?.map(content => ({
                _id: content?._id,
                title: content?.title,
                release_date: content?.release_date,
                genre: content?.genre,
                poster: content?.poster,
                Content_Type: content?.Content_Type,
            }))
        }

        return ContentsData?.docs

    }
    catch (error) {
        handelGraphqlError(error)
    }
}

const FetchContentDetailsController = async ({ ContentId }: ContentDetailsInput): Promise<ContentDetailsType> => {

    try {
        const { ContentId: verifiedId } = validate(ContentDetailsInputSchema, { ContentId })

        const contentDetails = await Content.aggregate([

            {
                $match: {
                    _id: new mongoose.Types.ObjectId(verifiedId)
                }
            }, {
                $lookup: {
                    from: "ratingstates",
                    localField: "_id",
                    foreignField: "ContentId",
                    as: "Ratings"
                }
            },
            {
                $lookup: {
                    from: "rates",
                    localField: "_id",
                    foreignField: "ContentId",
                    as: "userRating"
                }
            },
            {
                $unwind: {
                    path: "$Ratings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$userRating",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    title: 1,
                    director: 1,
                    genre: 1,
                    description: 1,
                    poster: 1,
                    backdrop: 1,
                    release_date: 1,
                    Content_Type: 1,
                    total_episodes: 1,
                    total_seasons: 1,
                    casts: 1,
                    whereTOwatch: 1,
                    runtime: 1,
                    userRating: "$userRating.rating",
                    totalNumberOfRating: "$Ratings.totalNumberOfRatings",
                    Ratings: {
                        masterpiecePercentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        "$Ratings.MasterPieceRating.totalCount",
                                        "$Ratings.totalNumberOfRatings"
                                    ]
                                },
                                100
                            ]
                        },
                        TimePassPercentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        "$Ratings.TimePassRating.totalCount",
                                        "$Ratings.totalNumberOfRatings"
                                    ]
                                },
                                100
                            ]
                        },
                        GoodWatchPercentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        "$Ratings.GoodWatchRating.totalCount",
                                        "$Ratings.totalNumberOfRatings"
                                    ]
                                },
                                100
                            ]
                        },
                        wasteOfTimePercentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        "$Ratings.wasteOfTime.totalCount",
                                        "$Ratings.totalNumberOfRatings"
                                    ]
                                },
                                100
                            ]
                        }
                    }

                }
            }
        ])

        if (!contentDetails || contentDetails.length === 0) {
            throwGraphqlError("Content Details not found", "NOT_FOUND", 404, true)
        }

        console.log(contentDetails[0])

        return contentDetails[0]

    } catch (error) {
        return handelGraphqlError(error)
    }

}

const FetchTrendingContents = async () => {

    try {

        const TrendingContentsData = await TrendingContent.aggregate([
            {
                $lookup: {
                    from: "contents",
                    localField: "contentId",
                    foreignField: "_id",
                    as: "TrendingContents"
                }
            }, {
                $unwind: {
                    path: "$TrendingContents",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$TrendingContents._id",
                    title: "$TrendingContents.title",
                    description: "$TrendingContents.description",
                    poster: "$TrendingContents.poster",
                    release_date: "$TrendingContents.release_date",
                    backdrop: "$TrendingContents.backdrop",
                    genre: "$TrendingContents.genre",
                    Content_Type: "$TrendingContents.Content_Type"
                }
            }
        ])




        if (!TrendingContentsData || TrendingContentsData.length === 0) {
            throwGraphqlError('Contents not found', 'PAGE_NOT_FOUND', 404, true)
        }

        return TrendingContentsData


    } catch (error) {
        handelGraphqlError(error)
    }


}

const fetchNewReleaseContents = async () => {
    try {
        const currentYear = String(new Date().getFullYear())
        const NewReleaseContentsData = await Content.aggregate([

            {
                $match: {
                    release_date: {
                        $regex: `^${currentYear}`
                    }
                }
            },

            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    poster: 1,
                    release_date: 1,
                    backdrop: 1,
                    genre: 1,
                    Content_Type: 1

                }
            },
            {
                $sort: {
                    release_date: 1
                }
            }
        ])



        if (!NewReleaseContentsData || NewReleaseContentsData.length === 0) {
            throwGraphqlError('Contents not found', 'PAGE_NOT_FOUND', 404, true)
        }

        return NewReleaseContentsData


    } catch (error) {
        handelGraphqlError(error)
    }
}

const FetchGeneralContentsForHomepage = async (page: PageNumberType) => {
    try {

        const validatedPage = validate(pageSchema, page)

        const aggregateResult = Content.aggregate([
            {
                $sort: {
                    release_date: -1
                }
            }
        ])

        const options = {
            page: validatedPage || 1,
            limit: 50,
        }

        const ContentsData = await Content.aggregatePaginate(aggregateResult, options)

        if (ContentsData.totalPages < validatedPage) {
            throwGraphqlError('Page not found', 'PAGE_NOT_FOUND', 404, true)
        }

        if (!ContentsData || ContentsData.docs.length === 0) {
            throwGraphqlError("No data found", "NOT_FOUND", 404, true)
        }

        return ContentsData.docs

    } catch (error) {
        handelGraphqlError(error)
    }

}



export {
    SearchContentsController,
    SaveContentsDataToDB,
    FetchContentDetailsController,
    FetchGeneralContentsForHomepage,
    FetchTrendingContents,
    fetchNewReleaseContents
}
