import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql";

import { FastifyType } from ".";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import {
  PostInput,
  PostUpdateInput,
  ProfileInput,
  ProfileUpdateInput,
  UserInput,
  UserUpdateInput,
} from "./graphql-input-types";
import { Post, Profile, User } from "./graphql-types";

export default new GraphQLObjectType({
  name: "Mutations",
  fields: {
    createUser: {
      type: User,
      args: {
        input: {
          type: new GraphQLNonNull(UserInput),
        },
      },
      resolve: function (parent, { input }, contextValue: FastifyType) {
        const { firstName, lastName, email } = input;
        return contextValue.db.users.create({ firstName, lastName, email });
      },
    },
    createProfile: {
      type: Profile,
      args: {
        input: {
          type: new GraphQLNonNull(ProfileInput),
        },
      },
      resolve: async function (parent, { input }, contextValue: FastifyType) {
        const memberType = await contextValue.db.memberTypes.findOne({
          key: "id",
          equals: input.memberTypeId,
        });
        const profile = await contextValue.db.profiles.findOne({
          key: "userId",
          equals: input.userId,
        });
        let result: ProfileEntity = {} as ProfileEntity;
        if (memberType && !profile) {
          result = await contextValue.db.profiles.create(input);
          if (!result) return;
        } else {
          return;
        }
        return result;
      },
    },
    createPost: {
      type: Post,
      args: {
        input: {
          type: new GraphQLNonNull(PostInput),
        },
      },
      resolve: function (parent, { input }, contextValue: FastifyType) {
        return contextValue.db.posts.create(input);
      },
    },
    updateUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: {
          type: new GraphQLNonNull(UserUpdateInput),
        },
      },
      resolve: function (parent, {id, input}, contextValue: FastifyType) {
        return contextValue.db.users.change(id, input);
      },
    },
    updateProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: {
          type: new GraphQLNonNull(ProfileUpdateInput),
        },
      },
      resolve: function (parent, { id, input }, contextValue: FastifyType) {
        return contextValue.db.profiles.change(id, input);
      },
    },
    updatePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: {
          type: new GraphQLNonNull(PostUpdateInput),
        },
      },
      resolve: function (parent, { id, input }, contextValue: FastifyType) {
        return contextValue.db.posts.change(id, input);
      },
    },
  },
});
