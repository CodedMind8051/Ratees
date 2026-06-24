import { gql } from "@apollo/client";

export const GET_REVIEWS = gql`
query GetReviews($contentId: String!, $page: Int!) {
  getReviews(ContentId: $contentId, page: $page) {
    _id
    review
    createdAt
    isOwn
    username
    userEmail
    userId
    profileImage
  }
}
`