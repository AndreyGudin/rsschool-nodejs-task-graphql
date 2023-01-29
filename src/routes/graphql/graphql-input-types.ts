import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

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

const PostInput = new GraphQLInputObjectType({
name: "PostInput",
fields: {
  title: { type: new GraphQLNonNull(GraphQLString) },
  content: { type: new GraphQLNonNull(GraphQLString) },
  userId: { type: new GraphQLNonNull(GraphQLID) },
},
});


export { UserInput, ProfileInput, PostInput}