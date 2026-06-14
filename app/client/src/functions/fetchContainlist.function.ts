import { apolloClient } from "@/graphql"
import { FetchContentsForHomepage } from "@/graphql/query/content.query"

export const FetchContentsForHomepageFunction = async ({ page = 1, setLoading }) => {

  try {
    const { data } = await apolloClient.query({
      query: FetchContentsForHomepage,
      variables: { page }
    })

    if (data) {
      setLoading(false)
    }

    const contents =
      (data as any).FetchContentsForHomepage ?? [];

    return {
      data:contents,
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