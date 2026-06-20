import axiosRetry from "axios-retry";
import { fetchContentListUrl, fetchContentDetailUrl, fetchTrendingContentUrl } from "../constants";
import axios, { type AxiosResponse } from "axios";
import { GraphQLError } from "graphql";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import mongoose from "mongoose";


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

const FetchCompleteContentDetail = async (response1st: AxiosResponse, DataLength: number): Promise<any[]> => {

    const ContentsDetails = []

    for (let index = 0; index < DataLength; index++) {
        const element = response1st?.data?.results[index];

        if (!element?.id || !element?.media_type) continue


        const response2nd = await axiosInstance.get(
            `${fetchContentDetailUrl}${element?.media_type}/${element?.id}?append_to_response=credits,watch/providers`
        )

        response2nd.data.Content_Type = element?.media_type
        response2nd.data.ContentId = new mongoose.Types.ObjectId()

        ContentsDetails.push(response2nd?.data)
    }
    return ContentsDetails
}

const FetchContentDataFromTmDb = async (contentName: string) => {
    try {

        const response1st = await axiosInstance.get(
            `${fetchContentListUrl}${contentName}`
        )

        if (!response1st?.data?.results || response1st?.data?.results.length === 0) {
            throwGraphqlError("No content found with the given name", "NOT_FOUND", 404, true)
        }



        const actualLength = response1st?.data?.results.length >= 5 ? 5 : response1st?.data?.results.length

        const ContentsDetails = await FetchCompleteContentDetail(response1st, actualLength)


        return ContentsDetails

    } catch (error) {

        if (error instanceof GraphQLError) {
            throwGraphqlError(error.message, "INTERNAL_SERVER_ERROR", 500, false)
        }

        if (axios.isAxiosError(error)) {
            throwGraphqlError("Failed to fetch data , please try again later", "TMDB_DATA_ERROR", 500, true)
        }

        throwGraphqlError("Something went wrong, please try again later", "INTERNAL_SERVER_ERROR", 500, false)

    }
}

const FetchTrendingContentsDataFromTmdb = async () => {

    try {
        const response1st = await axiosInstance.get(
            fetchTrendingContentUrl
        )

        if (!response1st?.data?.results || response1st?.data?.results.length === 0) {
            throwGraphqlError("No content found with the given name", "NOT_FOUND", 404, true)
        }

        const ContentsDetails = await FetchCompleteContentDetail(response1st, response1st?.data?.results.length)


        return ContentsDetails

    } catch (error) {
        if (error instanceof GraphQLError) {
            throwGraphqlError(error.message, "INTERNAL_SERVER_ERROR", 500, false)
        }

        if (axios.isAxiosError(error)) {
            throwGraphqlError("Failed to fetch data , please try again later", "TMDB_DATA_ERROR", 500, true)
        }

        throwGraphqlError("Something went wrong, please try again later", "INTERNAL_SERVER_ERROR", 500, false)

    }
}


export { FetchContentDataFromTmDb, FetchTrendingContentsDataFromTmdb }