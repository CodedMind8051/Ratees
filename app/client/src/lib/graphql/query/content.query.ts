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

const ContentFullDetail = `
   _id
    title
    release_date
    genre
    poster
    description
    backdrop
    Content_Type
    runtime
    whereTOwatch {
      platform
      logo
    }
    casts {
      name
      character
      profile_path
    }
    director
    userRating
    total_seasons
    total_episodes
    totalNumberOfRating
    Ratings { 
    masterpiecePercentage
    TimePassPercentage
    GoodWatchPercentage
    wasteOfTimePercentage
    }
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

export const FETCH_FULL_CONTENT_DETAIL = gql`
query GetContentDetails($ContentId: ID!) {
  getContentDetails(ContentId: $ContentId) {
     ${ContentFullDetail}
  }
}
`

export const SEARCH_CONTENT = gql`
query GetContentsList($query: String!, $page: Int!) {
  getContentsList(query: $query, page: $page) {
    _id
    title
    release_date
    genre
    poster
    Content_Type
  }
}
` 