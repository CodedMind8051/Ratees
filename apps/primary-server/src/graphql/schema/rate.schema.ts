const rateTypeDefs = `#graphql

    type Mutation {
        submitRating(ContentId: ID!, rating: Int!): Boolean!
    }

`

export { rateTypeDefs }