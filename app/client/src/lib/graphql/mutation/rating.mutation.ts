import { gql } from '@apollo/client';

export const SUBMIT_RATING = gql`
  mutation SubmitRating($ContentId: ID!, $rating: Int!) {
    submitRating(ContentId: $ContentId, rating: $rating)
  }
`;
