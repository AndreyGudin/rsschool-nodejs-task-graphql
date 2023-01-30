import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { FastifyType } from '.';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import {
  MemberTypesUpdateInput,
  PostInput,
  PostUpdateInput,
  ProfileInput,
  ProfileUpdateInput,
  SubscribeToUserInput,
  UserInput,
  UserUpdateInput,
} from './graphql-input-types';
import { MemberTypes, Post, Profile, User } from './graphql-types';

export default new GraphQLObjectType({
  name: 'Mutations',
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
          key: 'id',
          equals: input.memberTypeId,
        });
        const profile = await contextValue.db.profiles.findOne({
          key: 'userId',
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
      resolve: function (parent, { id, input }, contextValue: FastifyType) {
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
    updateMemberTypes: {
      type: MemberTypes,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: {
          type: new GraphQLNonNull(MemberTypesUpdateInput),
        },
      },
      resolve: function (parent, { id, input }, contextValue: FastifyType) {
        return contextValue.db.memberTypes.change(id, input);
      },
    },
    subscribeToUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(SubscribeToUserInput) },
      },
      resolve: async function (
        parent,
        { id, input: userId },
        contextValue: FastifyType
      ) {
        const subscribe = async (id: string, idToSubscribe: string) => {
          const user = (await contextValue.db.users.findOne({
            key: 'id',
            equals: id,
          })) as UserEntity;
          const result = await contextValue.db.users.change(id, {
            subscribedToUserIds: [...user.subscribedToUserIds, idToSubscribe],
          });
          return result;
        };
        const result:UserEntity = await subscribe(id, userId.userId);
        await subscribe(userId.userId, id);
        if (!result) return;
        return result;
      },
    },
    unSubscribeFromUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(SubscribeToUserInput) },
      },
      resolve: async function (
        parent,
        { id, input: userId },
        contextValue: FastifyType
      ) {
        const unsubscribe = async (id: string, idToSubscribe: string) => {
          const user = (await contextValue.db.users.findOne({
            key: 'id',
            equals: id,
          })) as UserEntity;
          const indexToUnSubscribe =
            user.subscribedToUserIds.indexOf(idToSubscribe);
          if (indexToUnSubscribe === -1) return;
          const subscriptions = [...user.subscribedToUserIds];
          subscriptions.splice(indexToUnSubscribe, 1);
          const result = await contextValue.db.users.change(id, {
            subscribedToUserIds: [...subscriptions],
          });
          return result;
        };
        const result = await unsubscribe(id, userId.userId);
        await unsubscribe(userId.userId, id);
        if (!result) return;
        return result;
      },
    },
  },
});
