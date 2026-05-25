const content = `#graphql

type Content{
    _id:ID!
    title:String!
    description:String!
    releaseDate:String!
    genre:String!
    image:String!
}

type Query{
   getContentsList(query:String!, page:String):[Content]!
}

`

export { content }