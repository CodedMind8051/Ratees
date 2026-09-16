
export const watchStatusTypeDefs = `#graphql

       scalar Date

        enum WatchStatusEnum {
          Watching
          Watched
          WatchLater
        }
        
        type WatchStatus {
          _id: ID!
          watchStatus: WatchStatusEnum!
        }
        

        type WatchStatusContentLists {
           _id: ID!
           contentId: ID!
           title: String!
           genre: [String!]!
           Content_Type: String!
           release_date: String!
           poster: String!
           createdAt: Date!
           isOwner: Boolean! 
         }

        
        
        type Query {
          getWatchStatusOfContent(
            contentId: ID!
          ): WatchStatus
        
          getContentListInWatchStatus(
            userId: ID!
            watchStatus: WatchStatusEnum!
            page: Int
          ): [WatchStatusContentLists!]!
        }
        
        type Mutation {
          submitWatchStatusOfContent(
            contentId: ID!
            watchStatus: WatchStatusEnum!
          ): Boolean!
        
          updateWatchStatusOfContent(
            contentId: ID!
            watchStatus: WatchStatusEnum!
          ): Boolean!
        
          deleteWatchStatusOfContent(
            contentId: ID!
          ): Boolean!
        }
`