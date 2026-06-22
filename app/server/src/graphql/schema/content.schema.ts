const contentTypeDefs = `#graphql

    type WatchPlatform {
          platform: String!
          logo: String!
      }
    
    type Cast {
          name: String!
          character: String!
          profile_path: String!
      }

      type Ratings {  
          masterpiecePercentage: Int
          TimePassPercentage: Int
          GoodWatchPercentage: Int
          wasteOfTimePercentage: Int
}

        type ContentDetails{
          _id: ID!,
          title: String!
          release_date: String!
          genre: [String!]!
          poster: String!
          description: String!
          backdrop: String!
          Content_Type: String!
          runtime: String
          whereTOwatch: [WatchPlatform!]
          casts: [Cast!]
          director: String
          userRating: Int
          total_seasons: Int
          total_episodes: Int
          Ratings:Ratings
    }


        type HomePageContent{
            _id: ID!,
            title: String!,
            description: String,
            release_date: String,
            genre: [String!]!,
            backdrop:String,
            poster: String!,
            Content_Type: String!,
    }


    type Query{

           getContentsList(
           query:String!, 
           page:Int!
           ):[ContentDetails]!,

           getContentDetails(
           ContentId:ID!
           ):ContentDetails!,

           FetchGeneralContentsForHomepage(
           page:Int!
           ):[HomePageContent]!,

           FetchTrendingContents:[HomePageContent]!,
           
           FetchNewReleaseContents:[HomePageContent]!,
    }



`

export { contentTypeDefs }