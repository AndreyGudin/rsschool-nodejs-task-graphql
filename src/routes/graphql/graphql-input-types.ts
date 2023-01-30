import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

const UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UserUpdateInput = new GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const ProfileInput = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const ProfileUpdateInput = new GraphQLInputObjectType({
  name: 'ProfileUpdateInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});

const PostInput = new GraphQLInputObjectType({
  name: 'PostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const PostUpdateInput = new GraphQLInputObjectType({
  name: 'PostUpdateInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const MemberTypesUpdateInput = new GraphQLInputObjectType({
  name: 'MemberTypesUpdateInput',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

const SubscribeToUserInput = new GraphQLInputObjectType({
  name: 'SubscribeToUserInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export {
  UserInput,
  ProfileInput,
  PostInput,
  UserUpdateInput,
  ProfileUpdateInput,
  PostUpdateInput,
  MemberTypesUpdateInput,
  SubscribeToUserInput,
};
