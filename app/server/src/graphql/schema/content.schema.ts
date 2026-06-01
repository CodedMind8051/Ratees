const content = `#graphql

    type Contents{
            _id: ID!,
            title: String!,
            description: String!,
            release_date: String!,
            genre: [String!]!,
            poster: String!,
            Content_Type: String!,
            runtime: String!
    }

    type Query{
           getContentsList(
           query:String!, 
           page:Int!
           ):[Contents]!
    }

`

export { content }