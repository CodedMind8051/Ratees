import { inngest } from "../client.inngest";
import { fetchContentListUrl } from "../../constants";



const fetchContentsInfo: ReturnType<typeof inngest.createFunction> = inngest.createFunction(
    { id: "fetchContentsInfo", timeouts: { start: "5s" ,  finish: "9s",}, triggers: [{ event: "Contents/info.fetch" }], retries: 2 },
    async ({ event, step }) => {
        const contentList = await step.fetch(
            `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(event?.data?.query)}`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                    accept: "application/json"
                },
            }
        )
        console.log(contentList)

        return contentList

    },
);


export { fetchContentsInfo }