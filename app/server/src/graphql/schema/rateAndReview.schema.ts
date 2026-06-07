const rateAndReviewTypeDefs = `
 
    type Mutation {
        submitRating(ContentId: ID!, rating: Int!): Boolean!
    }
`

export { rateAndReviewTypeDefs }