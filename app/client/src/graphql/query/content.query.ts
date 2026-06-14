import { gql } from "@apollo/client";

export const FetchContentsForHomepage = gql`
  query FetchContentsForHomepage($page: Int!) {
    FetchContentsForHomepage(page: $page) {
      _id
      title
      poster,
      backdrop
      Content_Type
      genre
      release_date
      description
    }
  }
`;
