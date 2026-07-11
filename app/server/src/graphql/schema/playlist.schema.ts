export const playlistTypeDefs = `#graphql

         scalar Date

         type Playlist {
             _id: ID!
             playlistName: String!
             description: String
             userId: ID!
             isPublic: Boolean!
             totalTracks: Int!
             isOwner: Boolean!
             coverImage: [String]
             createdAt: Date!
             updatedAt: Date!
         }

         type PlaylistItem {
             _id: ID!
             contentId: ID!
             title: String!
             genre: [String!]!
             Content_Type: String!
             runtime: String!
             release_date: String!
             poster: String!
             updatedAt:Date!
         }

         type PlaylistPagination {
             playlists: [Playlist!]!
             totalPages: Int!
             totalDocs: Int!
             currentPage: Int!
         }

         type PlaylistItemsPagination {
             items: [PlaylistItem!]!
             totalPages: Int!
             totalDocs: Int!
             currentPage: Int!
         }


         type Query {
             getPlaylists(page: Int!, userID: String!): PlaylistPagination,
             getPlaylistItems(playlistId: ID!, page: Int!): PlaylistItemsPagination,
         }

         type Mutation {
             createPlaylist(playlistName: String!, description: String, isPublic: Boolean!): Boolean!,
             updatePlaylist(playlistId: ID!, playlistName: String, description: String, isPublic: Boolean): Boolean!,
             deletePlaylist(playlistId: ID!): Boolean!,
             createPlaylistItem(contentId: ID!, playlistId: ID!): Boolean!,
             deletePlaylistItem(contentId: ID!, playlistId: ID!): Boolean!
         }


`