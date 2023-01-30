import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} from "graphql";
import { PostEntity } from "../../utils/DB/entities/DBPosts";

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
    monthPostsLimit: { type: GraphQLInt },
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
        resolve: function(parent, args, contextValue) {
          return parent.subscribedToUserIds;
        }
      },
      profile: {
        type: Profile,
        resolve(parent, args, contextValue) {
          return contextValue.db.profiles.findOne({
            key: "userId",
            equals: parent.id,
          });
        },
      },
      posts: {
        type: new GraphQLList(Post),
        resolve:async function(parent, args, contextValue) {
          const posts = await contextValue.db.posts.findMany();
          const result = posts.filter((post: PostEntity) => post.userId === parent.id);
          return result;
        },
      },
      memberType: {
        type: MemberTypes,
        resolve: async function(parent, args, contextValue) {
          const profile = await contextValue.db.profiles.findOne({key:'userId', equals:parent.id});
          const memberType = await contextValue.db.memberTypes.findOne({
            key: "id",
            equals: profile?.memberTypeId,
          });
          console.log("profile", profile);
          console.log("memberType", memberType);
          return memberType;
        },
      },
    };
  },
});

export { User, Profile, Post, MemberTypes };
