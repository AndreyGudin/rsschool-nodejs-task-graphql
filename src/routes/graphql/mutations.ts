import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { FastifyType } from ".";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { Post, Profile, User } from "./graphql-types";

export default new GraphQLObjectType({
  name: "Mutations",
  fields: {
    createUser: {
      type: User,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: function (
        parent,
        { firstName, lastName, email },
        contextValue: FastifyType
      ) {
        return contextValue.db.users.create({ firstName, lastName, email });
      },
    },
    createProfile: {
      type: Profile,
      args: {
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLString },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        memberTypeId: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve: async function (
        parent,
        { avatar, sex, birthday, country, street, city, memberTypeId, userId },
        contextValue: FastifyType
      ) {
        const body = {
          avatar,
          sex,
          birthday,
          country,
          street,
          city,
          memberTypeId,
          userId,
        };
        const memberType = await contextValue.db.memberTypes.findOne({
          key: "id",
          equals: memberTypeId,
        });
        const profile = await contextValue.db.profiles.findOne({
          key: "userId",
          equals: userId,
        });
        let result: ProfileEntity = {} as ProfileEntity;
        if (memberType && !profile) {
          result = await contextValue.db.profiles.create(body);
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
