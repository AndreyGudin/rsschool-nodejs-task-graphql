import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { User, Profile, Post, MemberTypes } from './graphql-types';

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
            },
            user: {
              type: User,
              args: { id: { type: GraphQLID}},
              resolve(parent, args) {
                return fastify.db.users.findOne({key:'id', equals: args.id})
              }
            },
            profile: {
              type: Profile,
              args: { id: { type: GraphQLID}},
              resolve(parent, args) {
                return fastify.db.profiles.findOne({key:'id', equals: args.id})
              }
            },
            post: {
              type: Post,
              args: { id: { type: GraphQLID}},
              resolve(parent, args) {
                return fastify.db.posts.findOne({key:'id', equals: args.id})
              }
            },
            memberType: {
              type: MemberTypes,
              args: { id: { type: GraphQLID}},
              resolve(parent, args) {
                return fastify.db.memberTypes.findOne({key:'id', equals: args.id})
              }
            },
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
              resolve: function(parent, {firstName, lastName, email}, contextValue) {
                return fastify.db.users.create({firstName, lastName, email});
              }

            }

          }
        })
        
      });
      return await graphql({ schema, source, contextValue: fastify});
    }
  );
};

export default plugin;
