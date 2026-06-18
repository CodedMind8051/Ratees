import { gql } from "@apollo/client";

const ContentListFields = `
        _id
        title
        description
        release_date
        genre
        backdrop
        poster
        Content_Type
`

export const FETCH_NEW_RELEASE_CONTENTS = gql`
query Query {
  FetchNewReleaseContents {
   ${ContentListFields}
  }
}
`

export const FETCH_TRENDING_CONTENTS = gql`
query Query {
  FetchTrendingContents {
     ${ContentListFields}
  }
}
`

export const FETCH_GENERAL_CONTENTS_FOR_HOME_PAGE = gql`
query Query($page: Int!) {
  FetchGeneralContentsForHomepage(page: $page) {
       ${ContentListFields}
  }
}
`

export const FETCH_COMPLETE_HOME_PAGE_DATA = gql`
  query FetchHomePageData($page: Int!) {
    FetchTrendingContents {
      ${ContentListFields}
    }

    FetchNewReleaseContents {
      ${ContentListFields}
    }

    FetchGeneralContentsForHomepage(page: $page) {
      ${ContentListFields}
    }
  }
`;