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
    
    type Director {
          name: String!
          profile_path: String!
      }
    

        type ContentDetails{
            _id: ID!,
            title: String!,
            description: String,
            release_date: String,
            genre: [String!]!,
            poster: String!,
            Content_Type: String!,
            runtime: String,
            whereTOwatch:[WatchPlatform]
            casts:[Cast],
            director:[Director]
            total_seasons:Int,
            total_episodes:Int
    }


        type ContentDetails2{
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
           _id:ID!
           ):ContentDetails!

           FetchContentsForHomepage(
           page:Int!
           ):[ContentDetails2]
    }

`

export { contentTypeDefs }