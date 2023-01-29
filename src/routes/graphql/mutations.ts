import {
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { User, Profile, Post, MemberTypes } from './graphql-types';

export default new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: User,
      args: {
        firstName: {type: GraphQLString},
        lastName: { type: GraphQLString},
        email: { type: GraphQLString},
      },
      resolve: function(parent, {firstName, lastName, email}, contextValue) {
        return contextValue.db.users.create({firstName, lastName, email});
      }

    }

  }
})