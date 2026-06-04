import { inngest } from "../client.inngest";
import { SaveContentsDataToDB } from "../../controllers/content.controller";

const SaveContentsDataToDBJob: ReturnType<typeof inngest.createFunction> = inngest.createFunction(
    { id: "saveContentData", timeouts: { start: "5s", finish: "10s", }, triggers: [{ event: "Contents/data.save" }], retries: 2 },
    async ({ event, step }) => {
        const { ContentsToInsert } = event?.data

        await step.run("Saving contents data to DB", async () => {
            try {
                await SaveContentsDataToDB(ContentsToInsert)
            } catch (error) {
                return error
            }

        })

    },
);


export { SaveContentsDataToDBJob }