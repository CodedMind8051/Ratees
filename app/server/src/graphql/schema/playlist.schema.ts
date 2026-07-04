const playlistTypeDefs = `#graphql
         
         scalar Date
         
         type Playlist {
             _id: ID!
             playlistName: String!
             description: String
             userId: ID!
             isPublic: Boolean!
             totalTracks: Int!
             createdAt: Date!
             updatedAt: Date!
         }
         
         type Query {
             getPlaylists(page: Int!, userID: String!): [Playlist!]!
         }

         type Mutation {
             createPlaylist(playlistName: String!, description: String, isPublic: Boolean!): Boolean!
             updatePlaylist(playlistId: ID!, playlistName: String, description: String, isPublic: Boolean): Boolean!
             deletePlaylist(playlistId: ID!): Boolean!
         }
     

`