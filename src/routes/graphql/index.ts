import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema } from 'graphql';

import rootQuery from './rootQuery';
import mutations from './mutations';

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
        mutation: mutations
      });
      return await graphql({ schema, source, contextValue: fastify});
    }
  );
};

export default plugin;
