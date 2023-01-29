import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import { FastifyType } from ".";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { Post, Profile, User } from "./graphql-types";

const UserInput = new GraphQLInputObjectType({
    name: "UserInput",
    fields: {
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      lastName: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
    }
})

const ProfileInput = new GraphQLInputObjectType({
  name: "ProfileInput",
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString)},
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }
})

export default new GraphQLObjectType({
  name: "Mutations",
  fields: {
    createUser: {
      type: User,
      args: {
        input: {
          type: new GraphQLNonNull(UserInput)
        }
      },
      resolve: function (
        parent,
        { input },
        contextValue: FastifyType
      ) {
        const {firstName, lastName, email} = input;
        return contextValue.db.users.create({ firstName, lastName, email });
      },
    },
    createProfile: {
      type: Profile,
      args: {
        input: {
          type: new GraphQLNonNull(ProfileInput)
        }
      },
      resolve: async function (
        parent,
        { input },
        contextValue: FastifyType
      ) {
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
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve: function (
        parent,
        { title, content, userId },
        contextValue: FastifyType
      ) {
        return contextValue.db.posts.create({ title, content, userId });
      },
    },
  },
});
