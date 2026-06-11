const rateTypeDefs = `

    type Mutation {
        submitRating(ContentId: ID!, rating: Int!): Boolean!
    }


`

export { rateTypeDefs }