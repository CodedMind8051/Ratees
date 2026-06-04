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

        const actualLength = response1st?.data?.results.length >= 5 ? 5 : response1st?.data?.results.length

        const ContentPromises = response1st?.data?.results.slice(0, actualLength).map((element: any) => {

            if (!element?.id || !element?.media_type) return null

            return axiosInstance.get(
                `${fetchContentDetailUrl}${element?.media_type}/${element?.id}?append_to_response=credits,watch/providers`
            )
        })

        const response2nd = await Promise.all(ContentPromises)

        const ContentsDetails = response2nd.map((res) => res?.data).filter((data) => data)

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

const a = await FetchContentDataFromTmDb("avengers")

console.log(a, "a")

export { FetchContentDataFromTmDb }






/*   
const contentResolver = {

    Query: {

        getContentsList: async (

            _: any, args: SearchContentInput,

            context: MyContextType) => {



            const contents = await SearchContentsController(args)



            return contents

        },



        getContentDetails: async (

            _: any,

            args: MongooseIdInput,

            context: MyContextType) => {



            validate(MongooseIdSchema, args)





        }



    }

}





not just want to do args i want to specify what and where data comes like 1st but also want to use SearchContentInput



because it is very difficult for other to understand and not readable 

*/