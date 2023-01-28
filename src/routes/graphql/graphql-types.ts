import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLInt } from 'graphql';

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type:GraphQLID },
    firstName: {type: GraphQLString},
    lastName: { type: GraphQLString},
    email: { type: GraphQLString},
    subscribedToUserIds: { type: new GraphQLList(GraphQLString)}
  }
})

const Profile = new GraphQLObjectType({
  name: "Profile",
  fields: {
    id: { type:GraphQLID },
    avatar:  {type: GraphQLString},
    sex:  {type: GraphQLString},
    birthday:  {type: GraphQLString},
    country:  {type: GraphQLString},
    street:  {type: GraphQLString},
    city:  {type: GraphQLString},
    memberTypeId:  {type: GraphQLString},
    userId:  {type: GraphQLString},
  }
})

const Post = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    userId: {type: GraphQLID},
  }
})

const MemberTypes = new GraphQLObjectType({
  name: "MemberTypes",
  fields: {
    id: {type: GraphQLString},
    discount: {type: GraphQLInt},
    monthPostsLimit: {type: GraphQLString},
  }
})

export {User, Profile, Post, MemberTypes}
