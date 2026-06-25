const reviewTypeDefs = `
    scalar Date

    type ReviewsDetailsData{
    _id:ID!,
    review:String!,
    createdAt:Date!,
    isOwn:Boolean!
    userId:ID!,
    username:String!,
    userEmail:String!,
    profileImage:String!
    }

    type Query{
    getReviews(ContentId:ID! , page:Int!):[ReviewsDetailsData]!
    }

    type Mutation {
        submitReview(ContentId: ID!, review: String!): Boolean!
        updateReview(reviewId:ID! , review:String!):Boolean!
        deleteReview(reviewId:ID!):Boolean!
    }



`

export { reviewTypeDefs }