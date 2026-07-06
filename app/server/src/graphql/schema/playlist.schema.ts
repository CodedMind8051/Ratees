export const playlistTypeDefs = `#graphql
         
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

         type PlaylistItem {
             _id: ID!
             title: String!
             genre: [String!]!
             Content_Type: String!
             runtime: String!
             release_date: String!
             poster: String!
         }

         
         type Query {
             getPlaylists(page: Int!, userID: String!): [Playlist!]!,
             getPlaylistItems(playlistId: ID!, page: Int!): [PlaylistItem!]!,
         }

         type Mutation {
             createPlaylist(playlistName: String!, description: String, isPublic: Boolean!): Boolean!,
             updatePlaylist(playlistId: ID!, playlistName: String, description: String, isPublic: Boolean): Boolean!,
             deletePlaylist(playlistId: ID!): Boolean!,
             createPlaylistItem(contentId: ID!, playlistId: ID!): Boolean!,
             deletePlaylistItem(contentId: ID!, playlistId: ID!): Boolean!
         }
     

`