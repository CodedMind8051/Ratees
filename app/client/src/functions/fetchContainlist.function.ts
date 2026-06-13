import { gql } from "@apollo/client";

export const FETCH_CONTENTS_FOR_HOMEPAGE = gql`
  query FetchContentsForHomepage($page: Int!) {
    FetchContentsForHomepage(page: $page) {
      _id
      title
      poster
      Content_Type
      genre
      release_date
      description
    }
  }
`;