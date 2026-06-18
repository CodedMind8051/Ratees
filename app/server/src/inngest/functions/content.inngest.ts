import { inngest } from "../client.inngest";
import { SaveContentsDataToDB } from "../../controllers/content.controller";
import { FetchTrendingContentsDataFromTmdb } from "../../services/tmdb.service";
import { TrendingContent } from "../../models/content.model";
import { TmdbContentToContentDocument } from "../../utils/content.utils"

const SaveContentsDataToDBJob: ReturnType<typeof inngest.createFunction> = inngest.createFunction(
    { id: "saveContentData", timeouts: { start: "5s", finish: "10s", }, triggers: [{ event: "Contents/data.save" }], retries: 2 },
    async ({ event, step }) => {
        const { ContentsToInsert } = event?.data

        await step.run("Saving contents data to DB", async () => {
            try {
                await SaveContentsDataToDB(ContentsToInsert)
            } catch (error) {
                throw error
            }

        })

    },
);


const SaveTrendingContentsDataToDBCroneJob: ReturnType<typeof inngest.createFunction> = inngest.createFunction(
    { id: "saveTrendingContentData_CroneJob", timeouts: { start: "5s", finish: "120s", }, triggers: { cron: "TZ=Asia/Kolkata */10 * * * *" }, retries: 3 },

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
                }).filter((content: any) => content !== null)


                if (!ContentsToInsert || ContentsToInsert.length === 0) {
                    return Error('No content found')
                }

                await inngest.send({
                    name: "Contents/data.save",
                    data: {
                        ContentsToInsert
                    }
                })



            } catch (error) {
                throw error
            }

        })

        await step.run("Saving TrendingContent id to Db", async () => {

            try {

                await TrendingContent.deleteMany({})

                const TrendingDataToInsert = TrendingContents.map((content: any) => {

                    if (!["movie", "tv"].includes(content?.Content_Type)) {
                        return null
                    }

                    return { contentId: content?.ContentId }

                }).filter((content: any) => content !== null)

                await TrendingContent.insertMany(
                    TrendingDataToInsert
                )

            } catch (error) {
                throw error
            }


        })

    },
);





export { SaveContentsDataToDBJob, SaveTrendingContentsDataToDBCroneJob }