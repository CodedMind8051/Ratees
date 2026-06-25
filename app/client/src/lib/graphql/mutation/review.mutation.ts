import { gql } from "@apollo/client"

export const SUBMIT_REVIEWS = gql`
     mutation SubmitReview($contentId: ID!, $review: String!) {
       submitReview(ContentId: $contentId, review: $review)
     }

`

export const UPDATE_REVIEW = gql`
     mutation UpdateReview($reviewId: ID!, $review: String!) {
       updateReview(reviewId: $reviewId, review: $review)
     }
`

export const DELETE_REVIEW = gql`
     mutation DeleteReview($reviewId: ID!) {
       deleteReview(reviewId: $reviewId)
}
`