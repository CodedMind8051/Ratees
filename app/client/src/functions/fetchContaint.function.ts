import { apolloClient } from "@/lib/graphql"
import { FETCH_HOME_PAGE_DATA } from "@/lib/graphql/query/content.query"

export const FetchContentsForHomepageFunction = async ({ page = 1, setLoading }) => {

  try {
    const { data } = await apolloClient.query({
      query: FETCH_HOME_PAGE_DATA,
      variables: { page }
    })

    if (data) {
      setLoading(false)
    }

    const contents =
      (data as any).FetchContentsForHomepage ?? [];

    return {
      data: contents,
      error: null,
    };
  } catch (error) {
    console.log(error)
    return {
      data: [],
      error,
    };
  }

}

export const fetchTreadingContents = ({
  page = 1,
  setLoading
}: {
  page: Number,
  setLoading: Boolean
}) => {




}