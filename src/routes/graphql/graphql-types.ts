import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} from "graphql";
import { FastifyType } from ".";

const Profile = new GraphQLObjectType({
  name: "Profile",
  fields: {
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
  },
});

const Post = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});

const MemberTypes = new GraphQLObjectType({
  name: "MemberTypes",
  fields: {
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLString },
  },
});

const User:GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => {
    return {
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
      subscribedToUser: {
        type: new GraphQLList(User),
        resolve: function(parent, args, contextValue: FastifyType) {
          return parent.subscribedToUserIds;
        }
      },
      profile: {
        type: Profile,
        resolve(parent, args, contextValue: FastifyType) {
          return contextValue.db.profiles.findOne({
            key: "userId",
            equals: parent.id,
          });
        },
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(parent, args, contextValue: FastifyType) {
          return contextValue.db.posts.findOne({
            key: "userId",
            equals: parent.id,
          });
        },
      },
      memberType: {
        type: MemberTypes,
        resolve(parent, args, contextValue: FastifyType) {
          return contextValue.db.memberTypes.findOne({
            key: "id",
            equals: parent.id,
          });
        },
      },
    };
  },
});

export { User, Profile, Post, MemberTypes };
