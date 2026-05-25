const User = `#graphql
     type User{
          _id:Int!
          name:String!
          age:Int!
      }


  type Query{
        Getuser(_id:Int!):String!
      }

`

export {User}