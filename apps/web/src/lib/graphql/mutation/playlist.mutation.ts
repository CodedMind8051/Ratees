import { gql } from '@apollo/client';

// ============================================
// PLAYLIST MUTATIONS
// ============================================

export const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist($playlistName: String!, $description: String, $isPublic: Boolean!) {
    createPlaylist(playlistName: $playlistName, description: $description, isPublic: $isPublic)
  }
`;

export const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($playlistId: ID!, $playlistName: String, $description: String, $isPublic: Boolean) {
    updatePlaylist(playlistId: $playlistId, playlistName: $playlistName, description: $description, isPublic: $isPublic)
  }
`;

export const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($playlistId: ID!) {
    deletePlaylist(playlistId: $playlistId)
  }
`;

export const CREATE_PLAYLIST_ITEM = gql`
  mutation CreatePlaylistItem($contentId: ID!, $playlistId: ID!) {
    createPlaylistItem(contentId: $contentId, playlistId: $playlistId)
  }
`;

export const DELETE_PLAYLIST_ITEM = gql`
  mutation DeletePlaylistItem($contentId: ID!, $playlistId: ID!) {
    deletePlaylistItem(contentId: $contentId, playlistId: $playlistId)
  }
`;