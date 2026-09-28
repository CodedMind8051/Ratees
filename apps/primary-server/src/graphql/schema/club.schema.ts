export const clubTypeDefs = `#graphql

         scalar Date

         type Club {
             _id: ID!
             name: String!
             description: String
             thumbnail: String
             ispublic: Boolean!
             maxMemberLimit: Int!
             createdAt: Date!
             updatedAt: Date!
         }

         type Query {
             getClub(clubId: ID!): Club!
         }

         type SearchClubsResponse {
             clubs: [Club!]!,
             totalPages: Int!,
             totalDocs: Int!,
             currentPage: Int!
         }

         type Query {
             searchClubs(searchTerm: String!, page: Int!): SearchClubsResponse!
         }

         type Mutation {
             createClub(name: String!, description: String, password: String, thumbnail: String, ispublic: Boolean!, maxMemberLimit: Int): Boolean!,
             updateClub(clubId: ID!, name: String, description: String, password: String, thumbnail: String, ispublic: Boolean, maxMemberLimit: Int): Boolean!,
             deleteClub(clubId: ID!): Boolean!,
         }


`
