import axiosRetry from "axios-retry";
import { fetchContentListUrl } from "../constants";
import axios from "axios";
import { GraphQLError } from "graphql";

const axiosInstance = axios.create()

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

        const token = process.env.TMDB_TOKEN

        if (!token) {
            throw new Error("TMDB token missing")
        }

        const response = await axiosInstance.get(
            `${fetchContentListUrl}${contentName}`,
            {
                timeout: 15000,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }

            }
        )

        if (!response?.data) {
            throw new GraphQLError("No data received ", {
                extensions: {
                    code: "INTERNAL_SERVER_ERROR",
                    http: { status: 500 }
                }
            })
        }

        return response?.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            const status = error?.response?.status || 503
            const message = error?.response?.statusText || "Failed to fetch content"
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


export { FetchContentDataFromTmDb }