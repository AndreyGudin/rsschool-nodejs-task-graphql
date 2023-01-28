import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLInt } from 'graphql';

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type:GraphQLID },
    firstName: {type: GraphQLString},
    lastName: { type: GraphQLString},
    email: { type: GraphQLString},
    subscribedToUserIds: { type: new GraphQLList(GraphQLString)}
  }
})

const Profile = new GraphQLObjectType({
  name: "Profile",
  fields: {
    id: { type:GraphQLID },
    avatar:  {type: GraphQLString},
    sex:  {type: GraphQLString},
    birthday:  {type: GraphQLString},
    country:  {type: GraphQLString},
    street:  {type: GraphQLString},
    city:  {type: GraphQLString},
    memberTypeId:  {type: GraphQLString},
    userId:  {type: GraphQLString},
  }
})

const Post = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    userId: {type: GraphQLID},
  }
})

const MemberTypes = new GraphQLObjectType({
  name: "MemberTypes",
  fields: {
    id: {type: GraphQLString},
    discount: {type: GraphQLInt},
    monthPostsLimit: {type: GraphQLString},
  }
})

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source:string = request.body.query!;
      console.log("source", source);
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'RootQueryType',
          fields: {
            users: {
              type: new GraphQLList(User),
              resolve() {
                return fastify.db.users.findMany();
              }
            },
            profiles: {
              type: new GraphQLList(Profile),
              resolve() {
                return fastify.db.profiles.findMany();
              }
            },
            posts: {
              type: new GraphQLList(Post),
              resolve() {
                return fastify.db.posts.findMany();
              }
            },
            memberTypes: {
              type: new GraphQLList(MemberTypes),
              resolve() {
                return fastify.db.memberTypes.findMany();
              }
            }
          }
        }
        ),
        mutation: new GraphQLObjectType({
          name: 'Mutations',
          fields: {
            createUser: {
              type: User,
              args: {
                firstName: {type: GraphQLString},
                lastName: { type: GraphQLString},
                email: { type: GraphQLString},
              },
              resolve: function(parent, {firstName, lastName, email}) {
                return fastify.db.users.create({firstName, lastName, email});
              }

            }

          }
        })
        
      });
      return await graphql({ schema, source});
    }
  );
};

export default plugin;
