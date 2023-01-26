import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const result = (await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      })) as UserEntity;
      if (!result) reply.notFound();
      return result;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const result = await fastify.db.users.create(request.body);
      if (!result) reply.badRequest();
      return result;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const result = await fastify.db.users.delete(request.params.id);
      if (!result) reply.notFound();
      return result;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const subscribed = (await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      })) as UserEntity;
      const result = await fastify.db.users.change(request.params.id, {
        subscribedToUserIds: [
          ...subscribed.subscribedToUserIds,
          request.body.userId,
        ],
      });
      if (!result) reply.badRequest();
      return result;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = (await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      })) as UserEntity;
      const idToUnsubscribe = user.subscribedToUserIds.indexOf(request.body.userId);
      const subscribed = [...user.subscribedToUserIds];
      subscribed.splice(idToUnsubscribe,1);
      const result = await fastify.db.users.change(request.params.id, {
        subscribedToUserIds: [
          ...subscribed
        ],
      });
      if (!result) reply.badRequest();
      return result;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const result = await fastify.db.users.change(request.params.id, request.body);
      if (!result) reply.badRequest();
      return result;
    }
  );
};

export default plugin;
