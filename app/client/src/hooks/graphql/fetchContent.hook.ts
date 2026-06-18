import { FETCH_TRENDING_CONTENTS } from "@/lib/graphql/query/content.query";
import { useLazyQuery } from "@apollo/client/react";

export const useTrendingContentsHook = (
) => {
    const [getTrendingContents, result] = useLazyQuery(FETCH_TRENDING_CONTENTS)
    return {
        getTrendingContents,
        ...result
    }
}