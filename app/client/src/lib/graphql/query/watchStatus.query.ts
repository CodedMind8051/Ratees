import { gql } from '@apollo/client';

// ============================================
// WATCHSTATUS QUERIES
// ============================================

// Get watch status for a specific content
export const GET_WATCH_STATUS = gql`
  query GetWatchStatus($contentId: ID!) {
    getWatchStatusOfContent(contentId: $contentId) {
      _id
      watchStatus
    }
  }
`;

// Get list of content in a specific watch status
export const GET_WATCH_STATUS_CONTENT_LIST = gql`
  query GetWatchStatusContentList($userId: ID!, $watchStatus: WatchStatusEnum!, $page: Int) {
    getContentListInWatchStatus(userId: $userId, watchStatus: $watchStatus, page: $page) {
      _id
      title
      genre
      Content_Type
      release_date
      poster
      createdAt
      isOwner
    }
  }
`;

// ============================================
// WATCHSTATUS MUTATIONS
// ============================================

// Submit (create) watch status
export const SUBMIT_WATCH_STATUS = gql`
  mutation SubmitWatchStatus($contentId: ID!, $watchStatus: WatchStatusEnum!) {
    submitWatchStatusOfContent(contentId: $contentId, watchStatus: $watchStatus)
  }
`;

// Update watch status
export const UPDATE_WATCH_STATUS = gql`
  mutation UpdateWatchStatus($contentId: ID!, $watchStatus: WatchStatusEnum!) {
    updateWatchStatusOfContent(contentId: $contentId, watchStatus: $watchStatus)
  }
`;

// Delete watch status
export const DELETE_WATCH_STATUS = gql`
  mutation DeleteWatchStatus($contentId: ID!) {
    deleteWatchStatusOfContent(contentId: $contentId)
  }
`;