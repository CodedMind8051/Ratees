const User = `#graphql
     type User{
          _id:Int!
          name:String!
          age:Int!
      }


  type Query{
        GetUser(_id:Int!):User
      }

`

export {User}