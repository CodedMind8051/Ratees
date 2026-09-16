import { gql } from "@apollo/client";

export const GET_REVIEWS = gql`
query GetReviews($ContentId: ID!, $page: Int!) {
  getReviews(ContentId: $ContentId, page: $page) {
    _id
    review
    createdAt
    isOwn
    username
    userId
    profileImage
  }
}
`

