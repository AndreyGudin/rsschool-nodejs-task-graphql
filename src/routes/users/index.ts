import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
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
    "/",
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
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const user = (await fastify.db.users.findOne({
          key: "id",
          equals: request.params.id,
        })) as UserEntity;
        const usersIdSubscribedTo = [...user.subscribedToUserIds];
        const users = await Promise.all(
          usersIdSubscribedTo.map((userId) => {
            return fastify.db.users.findOne({
              key: "id",
              equals: userId,
            });
          })
        );
        users.forEach((user) => {
          if (user) {
            const id = user.subscribedToUserIds.indexOf(request.params.id);
            if (id > -1) user.subscribedToUserIds.splice(id, 1);
          }
        });
        await Promise.all(
          usersIdSubscribedTo.map((userId) => {
            const userToChange = users.find((user) => user?.id === userId);
            return fastify.db.users.change(userId, userToChange!);
          })
        );
        const result = await fastify.db.users.delete(request.params.id);
        const profile = await fastify.db.profiles.findOne({
          key: "userId",
          equals: request.params.id,
        });
        const posts = await fastify.db.posts.findMany({
          key: "userId",
          equals: request.params.id,
        });
        if (profile) await fastify.db.profiles.delete(profile.id);
        if (posts)
          await Promise.all(
            posts.map((post) => {
              return fastify.db.posts.delete(post.id);
            })
          );
        if (!result) reply.badRequest();
        return result;
      } catch (error) {
        reply.badRequest();
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const subscribe = async (id: string, idToSubscribe: string) => {
        const user = (await fastify.db.users.findOne({
          key: "id",
          equals: id,
        })) as UserEntity;
        const result = await fastify.db.users.change(id, {
          subscribedToUserIds: [...user.subscribedToUserIds, idToSubscribe],
        });
        return result;
      };
      const result = await subscribe(request.params.id, request.body.userId);
      await subscribe(request.body.userId, request.params.id);
      if (!result) reply.badRequest();
      return result;
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const unsubscribe = async (id: string, idToSubscribe: string) => {
        const user = (await fastify.db.users.findOne({
          key: "id",
          equals: id,
        })) as UserEntity;
        const indexToUnSubscribe =
          user.subscribedToUserIds.indexOf(idToSubscribe);
        if (indexToUnSubscribe === -1) reply.badRequest();
        const subscriptions = [...user.subscribedToUserIds];
        subscriptions.splice(indexToUnSubscribe, 1);
        const result = await fastify.db.users.change(id, {
          subscribedToUserIds: [...subscriptions],
        });
        return result;
      };
      const result = await unsubscribe(request.params.id, request.body.userId);
      await unsubscribe(request.body.userId, request.params.id);
      if (!result) reply.badRequest();
      return result;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | undefined> {
      try {
        const result = await fastify.db.users.change(
          request.params.id,
          request.body
        );
        if (!result) reply.badRequest();
        return result;
      } catch (error) {
        reply.badRequest();
      }
    }
  );
};

export default plugin;
