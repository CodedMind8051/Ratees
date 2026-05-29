import axiosRetry from "axios-retry";
import { fetchContentListUrl, fetchContentDetailUrl } from "../constants";
import axios from "axios";
import { GraphQLError } from "graphql";


const token = process.env.TMDB_TOKEN 

if (!token) {
    throw new Error("TMDB token missing")
}

const axiosInstance = axios.create({
    timeout: 15000,
    headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
    }

})

axiosRetry(
    axiosInstance,
    {
        retries: 2,
        retryDelay: () => 3000,
        retryCondition: (error) => !error?.response || error?.response?.status >= 500
    }
)

const FetchContentDataFromTmDb = async (contentName: string) => {
    try {

        const response1st = await axiosInstance.get(
            `${fetchContentListUrl}${contentName}`
        )


        if (!response1st?.data?.results || response1st?.data?.results.length === 0) {
            throw new GraphQLError("No data received ", {
                extensions: {
                    code: "INTERNAL_SERVER_ERROR",
                    http: { status: 500 }
                }
            })
        }

        const ContentsDetails = []

        const actualLength = response1st?.data?.results.length >= 5 ? 5 : response1st?.data?.results.length


        for (let index = 0; index < actualLength; index++) {
            const element = response1st?.data?.results[index];

            if (!element?.id || !element?.media_type) continue


            const response2nd = await axiosInstance.get(
                `${fetchContentDetailUrl}${element?.media_type}/${element?.id}?append_to_response=credits,watch/providers`
            )
            ContentsDetails.push(response2nd?.data)
        }

        console.log(ContentsDetails)

        return ContentsDetails

    } catch (error) {

        if (error instanceof GraphQLError) {
            throw error
        }

        if (axios.isAxiosError(error)) {
            const status = error?.response?.status || 503
            const message = "Failed to fetch content"
            throw new GraphQLError(message, {
                extensions: {
                    code: status >= 500 ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST",
                    http: { status: status }
                }
            })
        }
        throw new GraphQLError("something went wrong please try again..", {
            extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 }
            }
        })

    }
}

await FetchContentDataFromTmDb("avengers")

export { FetchContentDataFromTmDb }