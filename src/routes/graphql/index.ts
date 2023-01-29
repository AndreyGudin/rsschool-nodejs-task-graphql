import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from 'graphql';

import { User, Profile, Post, MemberTypes } from './graphql-types';
import rootQuery from './rootQuery';

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
        query: rootQuery,
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
