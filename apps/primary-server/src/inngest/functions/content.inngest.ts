import { inngest } from "../client.inngest";
import { SaveContentsDataToDB } from "../../controllers/content.controller";
import { FetchTrendingContentsDataFromTmdb } from "../../services/tmdb.service";
import { TrendingContent } from "../../models/content.model";
import { TmdbContentToContentDocument } from "../../utils/content.utils"
import type { ContentDetailsType } from "../../types/content.types";

const SaveTrendingContentsDataToDBCroneJob: ReturnType<typeof inngest.createFunction> = inngest.createFunction(
    { id: "saveTrendingContentData_CroneJob", timeouts: { start: "5s", finish: "120s", }, triggers: { cron: "TZ=Asia/Kolkata 0 0 * * *" }, retries: 3 },

    async ({ step }) => {

        const TrendingContents = await step.run("Fetching Trending movies from TMDB", async () => {

            try {
                const TrendingContents = await FetchTrendingContentsDataFromTmdb()
                return TrendingContents
            } catch (error) {
                throw error
            }

        })

        await step.run("Saving Trending contents data to DB", async () => {
            try {

                const ContentsToInsert = TrendingContents?.map((content: any) => {

                    if (!["movie", "tv"].includes(content?.Content_Type)) {
                        return null
                    }

                    return TmdbContentToContentDocument(content)
                }).filter((content: any): content is ContentDetailsType => content !== null)

                if (!ContentsToInsert || ContentsToInsert.length === 0) {
                    return Error('No content found')
                }

                await SaveContentsDataToDB(ContentsToInsert)

            } catch (error) {
                throw error
            }

        })

        await step.run("Saving TrendingContent id to Db", async () => {

            try {


                const TrendingDataToInsert = TrendingContents.map((content: any) => {

                    if (!["movie", "tv"].includes(content?.Content_Type)) {
                        return null
                    }

                    return { contentId: content?.ContentId, title: content?.title, Content_Type: content?.Content_Type }

                }).filter((content: any) => content !== null)

                const existedTrendingData = await TrendingContent.find({})

                if (!existedTrendingData || existedTrendingData.length === 0) {
                    await TrendingContent.insertMany(
                        TrendingDataToInsert
                    )

                    return "Success"
                }

                const MatchedData = existedTrendingData.filter(data => TrendingDataToInsert.some(
                    (NewData: { title: "string", Content_Type: "string" }) => {
                        return NewData?.title === data?.title && NewData?.Content_Type === data?.Content_Type
                    }
                ))


                const MatchedId = MatchedData.map(data => data?._id)

                const filteredTrendingData = TrendingDataToInsert.filter(
                    (data: { title: "string", Content_Type: "string" }) => !MatchedData.some(NewData => NewData?.title === data?.title && NewData?.Content_Type === data?.Content_Type)
                )

                await TrendingContent.deleteMany({
                    _id: { $nin: MatchedId }
                })

                await TrendingContent.insertMany(
                    filteredTrendingData
                )

                return "Success"

            } catch (error) {
                throw error
            }


        })

    },
);





export { SaveTrendingContentsDataToDBCroneJob }