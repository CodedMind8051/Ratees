const userTypeDefs = `#graphql

    type User {
        _id: ID!
        username: String!
        email: String!
        profileImage: String!
    }

    type Query {
        getUser: User!
    }

    type Mutation {
        updateUsername(username: String!): User!
        updatePassword(currentPassword: String!, newPassword: String!): Boolean!
    }
`

export { userTypeDefs }
