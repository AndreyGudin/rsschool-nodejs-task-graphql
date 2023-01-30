import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema } from 'graphql';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify/types/instance';
import { FastifyBaseLogger } from 'fastify/types/logger';
import { RawServerDefault } from 'fastify/types/utils';
import { IncomingMessage, ServerResponse } from 'node:http';

import rootQuery from './rootQuery';
import mutations from './mutations';

export type FastifyType = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  JsonSchemaToTsProvider
>;

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
      const source: string = request.body.query!;
      console.log('source', source);
      const schema = new GraphQLSchema({
        query: rootQuery,
        mutation: mutations,
      });
      return await graphql({
        schema,
        source,
        variableValues: request.body.variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
