import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const result = await fastify.db.profiles.findOne({key:'id', equals: request.params.id}) as ProfileEntity;
      if (!result) reply.notFound();
      return result;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const memberType = await fastify.db.memberTypes.findOne({key:'id', equals: request.body.memberTypeId});
      const profile = await fastify.db.profiles.findOne({key:'userId', equals:request.body.userId});
      let result:ProfileEntity={} as ProfileEntity;
      if (memberType && !profile) {
        result = await fastify.db.profiles.create(request.body);
        if (!result) reply.badRequest();
      } else {
        reply.badRequest();
      }
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
    async function (request, reply): Promise<ProfileEntity | undefined> {
      try {
        const result = await fastify.db.profiles.delete(request.params.id);
        if (!result) reply.notFound();
        return result;
      } catch (error) {
        reply.badRequest();
      }

    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | undefined> {
      try {
        const result = await fastify.db.profiles.change(request.params.id, request.body);
        if (!result) reply.badRequest();
        return result;
      } catch (error) {
        reply.badRequest();
      }

    }
  );
};

export default plugin;
