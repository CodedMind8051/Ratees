import { gql } from '@apollo/client';

// ============================================
// PLAYLIST QUERIES
// ============================================

export const GET_PLAYLISTS = gql`
  query GetPlaylists($page: Int!, $userID: String!) {
    getPlaylists(page: $page, userID: $userID) {
      playlists {
        _id
        playlistName
        description
        userId
        isPublic
        totalTracks
        isOwner
        coverImage
        createdAt
        updatedAt
      }
      totalPages
      totalDocs
      currentPage
    }
  }
`;

export const GET_PLAYLIST_ITEMS = gql`
  query GetPlaylistItems($playlistId: ID!, $page: Int!) {
    getPlaylistItems(playlistId: $playlistId, page: $page) {
      items {
        _id
        contentId
        title
        genre
        Content_Type
        runtime
        release_date
        poster
        updatedAt
      }
      totalPages
      totalDocs
      currentPage
    }
  }
`;