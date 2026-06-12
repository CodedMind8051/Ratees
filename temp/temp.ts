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


// git commit -m "Implement the Fetch Content Details , Also imporve type saftywith zod and make coustom zod schemas with reuseablity "




// Make a home page whcih shows movies , web series etc with a profile image in which user can click then a username change , password change , and logout option come  , search option and also  , with nav bar such as home , firends , Watchlist , playlists (user can add movies to playlist , change playlist name , delete it , update the list )



// when user click on any movie , other page open without redirect and shows , movie poster  , description , release date , gener , content type movie/web series etc , run time , (director , catses) with thier image , where to watch , also a meter which contain rating % waste of time , time pass , good watch , master piece ,  and also just after poster their is some icons or btn such as watched , watching , watch later in which user click to add it in their watch list and also a btn to add coustom playlist , and also a review or comment section with option like update comment , delete it , write new comment ,also options like to rate movie on the scale of waste of time , time pass , good watch , master piece , 



// when user click of friends another page open without redirect with a search and some user lists with profiles images , name and current watching content when user click any of the another user then other user profile opens whichs just shows playlists and their watchlist 



