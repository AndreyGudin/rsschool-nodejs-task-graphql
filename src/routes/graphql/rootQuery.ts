import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
} from "graphql";

import { User, Profile, Post, MemberTypes } from './graphql-types';

const rootQuery =  new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: function(parent, args, contextValue) {
        console.log("contextValue",contextValue);
        return contextValue.db.users.findMany();
      }
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve(parent, args, contextValue) {
        return contextValue.db.profiles.findMany();
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args, contextValue) {
        return contextValue.db.posts.findMany();
      }
    },
    memberTypes: {
      type: new GraphQLList(MemberTypes),
      resolve(parent, args, contextValue) {
        return contextValue.db.memberTypes.findMany();
      }
    },
    user: {
      type: User,
      args: { id: { type: GraphQLID}},
      resolve(parent, args, contextValue) {
        return contextValue.db.users.findOne({key:'id', equals: args.id})
      }
    },
    profile: {
      type: Profile,
      args: { id: { type: GraphQLID}},
      resolve(parent, args, contextValue) {
        return contextValue.db.profiles.findOne({key:'id', equals: args.id})
      }
    },
    post: {
      type: Post,
      args: { id: { type: GraphQLID}},
      resolve(parent, args, contextValue) {
        return contextValue.db.posts.findOne({key:'id', equals: args.id})
      }
    },
    memberType: {
      type: MemberTypes,
      args: { id: { type: GraphQLID}},
      resolve(parent, args, contextValue) {
        return contextValue.db.memberTypes.findOne({key:'id', equals: args.id})
      }
    },
  }
}
)

export default rootQuery;